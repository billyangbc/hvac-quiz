"use server";

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { mutateData } from "@/lib/services/mutate-data";
import fetchData from "@/lib/services/fetch-data";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import { getCurrentUser } from "@/lib/services/auth";

// Define the response type
interface UploadResponse {
  success: boolean;
  message: string;
  objectKey?: string;
  url?: string;
  uploadedData?: S3UploadData;
}

// S3Upload data type
interface S3UploadData {
  id?: string;
  bucketName: string;
  fileKey: string;
  serverType?: string;
  serverUrl?: string;
  imported?: boolean;
}

const getS3Url = (s3Data: S3UploadData) => {
  if (s3Data?.serverType == 's3') {
    return `https://${s3Data.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Data.fileKey}`;
  }

  // e.g. minio not support yet
  return '';
}

/**
 * Uploads a file to AWS S3
 * @param formData FormData containing the file to upload
 * @returns Object with success status, message, and URL if successful
 */
export async function uploadFileToS3(formData: FormData): Promise<UploadResponse> {
  try {
    // Check if user is authenticated
    const session = await getServerSession();
    if (!session) {
      return {
        success: false,
        message: "Unauthorized. Please sign in to upload files.",
      };
    }

    // Get the file from the FormData
    const file = formData.get("file") as File;
    
    // Validate file
    if (!file) {
      return {
        success: false,
        message: "No file provided",
      };
    }

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      return {
        success: false,
        message: "Only CSV files are allowed",
      };
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return {
        success: false,
        message: "File size exceeds the 10MB limit",
      };
    }

    // Get file buffer
    const fileBuffer = await file.arrayBuffer();

    // Create a unique file name with YYYYMMDDHHmmss format
    const now = new Date();
    const formattedDate = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');
    
    // Get file name without extension
    const fileNameParts = file.name.split('.');
    const extension = fileNameParts.pop();
    const baseName = fileNameParts.join('.');
    
    // Slugify the base name and create the final file name
    const slugifiedName = await slugify(baseName);
    const fileName = `${formattedDate}-${slugifiedName}.${extension}`;

    // Initialize S3 client
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ID || "",
      },
    });

    // Set up the parameters for S3 upload
    const s3Bucket = process.env.AWS_BUCKET_NAME || "";
    const s3Key = `${process.env.AWS_UPLOAD_FOLDER}/${fileName}`;
    const params = {
      Bucket: s3Bucket,
      Key: s3Key,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    };

    // Upload to S3
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const s3Data = {
      bucketName: s3Bucket,
      fileKey: s3Key,
      serverType: 's3'
    };
    // save the uploaded record in DB
    const saveResult = await saveUploadedData(s3Data);

    // Generate the URL for the uploaded file
    const fileUrl = (saveResult && saveResult?.data) ? getS3Url(saveResult?.data) : '';

    // Revalidate the path to update UI
    revalidatePath("/dashboard/import");

    return {
      success: true,
      message: "File uploaded successfully",
      objectKey: s3Key,
      url: fileUrl,
      uploadedData: saveResult?.data
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * Imports data from an uploaded S3 file
 * @param uploadedData S3UploadData object containing file information
 * @returns Object with success status and message
 */
export async function importData(uploadedData: S3UploadData) {
  try {
    // Check if user is authenticated
    const session = await getServerSession();
    if (!session) {
      return {
        success: false,
        message: "Unauthorized. Please sign in to import data.",
      };
    }

    // Initialize S3 client
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ID || "",
      },
    });

    // Set up the parameters for S3 download
    const params = {
      Bucket: uploadedData.bucketName,
      Key: uploadedData.fileKey,
    };

    // Get the file from S3
    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);
    
    // Convert the stream to a string
    const streamToString = async (stream: any): Promise<string> => {
      const chunks: Buffer[] = [];
      return new Promise((resolve, reject) => {
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      });
    };

    // Get the file content
    const fileContent = await streamToString(response.Body);
    
    //TODO: parse file concont convert to required data
    //...

    // Output the content to console
    console.log("Imported file content:", fileContent.substring(0, 500) + "...");
    
    // Update the imported status in the database
    const updateResult = await updateImportStatus(uploadedData.id);
    
    // Revalidate the path to update UI
    revalidatePath("/dashboard/import");

    return {
      success: true,
      message: "File imported successfully",
    };
  } catch (error) {
    console.error("Error importing file from S3:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * Updates the import status of an uploaded file
 * @param id ID of the uploaded file record
 * @returns Object with success status and message
 */
async function updateImportStatus(id?: string) {
  if (!id) {
    return {
      success: false,
      message: "No upload ID provided"
    };
  }

  const currUser = await getCurrentUser();
  if (!currUser) {
    return {
      success: false,
      message: "Unauthorized"
    };
  }

  try {
    const response = await mutateData("PUT", `/api/s3-uploads/${id}`, {
      data: {
        imported: true,
        importedAt: new Date().toISOString(),
        importedBy: currUser.id
      }
    });

    if (response?.error) {
      return {
        success: false,
        message: response.error.message,
      };
    }

    return {
      success: true,
      message: "Import status updated successfully",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * save uploaded file information to DB
 * @param uploadedData
 * @returns 
 */
export async function saveUploadedData(uploadedData: S3UploadData ) {
  const currUser = await getCurrentUser();
  if (!currUser) {
    return {
      success: false,
      message: "Unauthorized"
    }
  }
  const payload = {
    data: {
      ...uploadedData,
      uploader: currUser.id,
      imported: false
    }
  };

  try {
    const response = await mutateData("POST", "/api/s3-uploads", payload);

    if (response?.error) {
      return {
        success: false,
        message: response.error.message,
      };
    }

    return {
      success: true,
      message: "Upload record saved Successfully",
      data: response.data,
    };
  } catch (error) {
    return {
      succeess: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
