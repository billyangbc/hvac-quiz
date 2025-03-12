"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

// Define the response type
interface UploadResponse {
  success: boolean;
  message: string;
  objectKey?: string;
  url?: string;
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
    const s3Key = `${process.env.AWS_UPLOAD_FOLDER}/${fileName}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME || "",
      Key: s3Key,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    };

    // Upload to S3
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Generate the URL for the uploaded file
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_UPLOAD_FOLDER}/${fileName}`;

    // Revalidate the path to update UI
    revalidatePath("/dashboard/import");

    return {
      success: true,
      message: "File uploaded successfully",
      objectKey: s3Key,
      url: fileUrl,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
