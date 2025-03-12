"use server";

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { mutateData } from "@/lib/services/mutate-data";
import fetchData from "@/lib/services/fetch-data";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import { getCurrentUser } from "@/lib/services/auth";
import { getCategoryBySlug, createCategory } from "./category-actions";
import { createQuestion, QuestionMutateType } from "./question-actions";

// CSV Record interface
interface CSVRecord {
  "No#"?: string;
  Category: string;
  Content: string;
  "Option A": string;
  "Option B": string;
  "Option C": string;
  "Option D": string;
  "Option E"?: string;
  CorrectAnswer: string;
  Explanation?: string;
}

/**
 * Parse CSV content into an array of records
 * @param csvContent CSV content as string
 * @returns Array of parsed records
 */
function parseCSV(csvContent: string): CSVRecord[] {
  // Split by lines and remove empty lines
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  // Find the header line (the one with Category, Content, etc.)
  const headerIndex = lines.findIndex(line => 
    line.includes('Category') && line.includes('Content') && line.includes('CorrectAnswer')
  );
  
  if (headerIndex === -1) {
    throw new Error('CSV header not found');
  }
  
  // Parse header
  const headers = lines[headerIndex].split(',').map(h => h.trim());
  
  // Parse data rows (skip header)
  const records: CSVRecord[] = [];
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.startsWith('Core section') || line.startsWith('Type')) {
      continue; // Skip section headers or empty lines
    }
    
    // Split the line by commas, but handle quoted values
    const values: string[] = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    values.push(currentValue.trim());
    
    // Create record object
    const record: any = {};
    headers.forEach((header, index) => {
      if (index < values.length) {
        record[header] = values[index];
      }
    });
    
    records.push(record as CSVRecord);
  }
  
  return records;
}

/**
 * Convert CSV record to question object
 * @param record CSV record
 * @param categoryId Category ID
 * @returns Question object
 */
function convertRecordToQuestion(record: CSVRecord, categoryId: string): QuestionMutateType {
  // Get correct answer index (a=0, b=1, c=2, d=3)
  const correctChar = record.CorrectAnswer.toLowerCase();
  const correctIndex = correctChar.charCodeAt(0) - 97; // a=0, b=1...
  
  // Get options
  const options = [
    record["Option A"]?.trim(),
    record["Option B"]?.trim(),
    record["Option C"]?.trim(),
    record["Option D"]?.trim()
  ].filter(Boolean);
  
  // Get correct answer
  const correctAnswer = options[correctIndex];
  
  // Get incorrect answers (filter out the correct one)
  const incorrectAnswers = options.filter((_, i) => i !== correctIndex);
  
  // Create question object
  return {
    category: categoryId,
    content: record.Content,
    correctAnswer: correctAnswer,
    incorrect_1: incorrectAnswers[0] || '',
    incorrect_2: incorrectAnswers[1] || '',
    incorrect_3: incorrectAnswers[2] || '',
    explanation: record.Explanation || '',
    difficulty: 'medium' // Default difficulty
  };
}

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

    // Parse CSV content
    const parsedData = parseCSV(fileContent);
    
    // Process each record
    const importResults = {
      total: parsedData.length,
      success: 0,
      failures: [] as Array<{
        rowNumber: number;
        errorType: string;
        message: string;
      }>
    };

    // Process each record
    for (let i = 0; i < parsedData.length; i++) {
      const record = parsedData[i];
      try {
        // Skip invalid records
        if (!record.Category || !record.Content || !record["Option A"] || !record["Option B"] || !record["Option C"] || !record.CorrectAnswer) {
          importResults.failures.push({
            rowNumber: i + 1,
            errorType: 'DATA_VALIDATION',
            message: 'Missing required fields (Category or Content or no option)'
          });
          continue;
        }

        // Extract category and get or create it
        const categorySlug = await slugify(record.Category);
        let categoryData = await getCategoryBySlug(categorySlug);
        
        // If category doesn't exist, create it
        if (!categoryData || categoryData.length === 0) {
          const categoryResult = await createCategory({
            categoryName: record.Category,
            description: `Automatically created category for ${record.Category}`,
            slug: categorySlug
          });
          
          if (!categoryResult.data) {
            importResults.failures.push({
              rowNumber: i + 1,
              errorType: 'CATEGORY_CREATION_FAILED',
              message: categoryResult.message || 'Failed to create category'
            });
            continue;
          }
          
          categoryData = [categoryResult.data];
        }
        
        // Get category ID
        const categoryId = categoryData[0]?.id;
        if (!categoryId) {
          importResults.failures.push({
            rowNumber: i + 1,
            errorType: 'CATEGORY_NOT_FOUND',
            message: 'Category ID not found'
          });
          continue;
        }
        
        // Convert record to question object
        const questionData = convertRecordToQuestion(record, categoryId);
        
        // Create question
        const questionResult = await createQuestion(questionData);
        
        if (questionResult.apiErrors) {
          importResults.failures.push({
            rowNumber: i + 1,
            errorType: 'QUESTION_CREATION_FAILED',
            message: questionResult.message || 'Failed to create question'
          });
          continue;
        }
        
        // Increment success count
        importResults.success++;
      } catch (error) {
        importResults.failures.push({
          rowNumber: i + 1,
          errorType: 'PROCESSING_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    console.log("Import results:", JSON.stringify(importResults, null, 2));

    // Update the imported status in the database
    const updateResult = await updateImportStatus(uploadedData.id);
    
    // Revalidate the path to update UI
    revalidatePath("/dashboard/import");

    return {
      success: true,
      message: `File imported successfully. ${importResults.success} of ${importResults.total} records imported.`,
      importResults
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
