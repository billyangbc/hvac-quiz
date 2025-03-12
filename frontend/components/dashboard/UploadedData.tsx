'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { importData } from "@/lib/actions/dashboard/import-actions";
import { LuFileCheck, LuCheck, LuX, LuDownload, LuExternalLink } from "react-icons/lu";

// Define the S3UploadData type based on the import-actions.ts file
interface S3UploadData {
  id?: string;
  bucketName: string;
  fileKey: string;
  serverType?: string;
  serverUrl?: string;
  imported?: boolean;
}

interface UploadedDataProps {
  uploadedData: S3UploadData;
}

export const UploadedData = ({ uploadedData }: UploadedDataProps) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Extract filename from fileKey
  const fileName = uploadedData.fileKey.split('/').pop() || 'Unknown file';
  
  // Generate S3 URL
  const fileUrl = uploadedData.serverType === 's3' 
    ? `https://${uploadedData.bucketName}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${uploadedData.fileKey}`
    : '';

  const handleImport = async () => {
    try {
      setIsImporting(true);
      setImportResult(null);

      const result = await importData(uploadedData);
      setImportResult(result);
    } catch (error) {
      setImportResult({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <LuFileCheck className="h-5 w-5" />
          Uploaded File
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <LuFileCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-800 dark:text-blue-300">{fileName}</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  Status: {uploadedData.imported ? 'Imported' : 'Ready to import'}
                </p>
                {/*
                {fileUrl && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <LuExternalLink className="h-4 w-4" />
                    <a 
                      href={fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      View file
                    </a>
                  </div>
                )}
                */}
              </div>
            </div>
          </div>

          {importResult && (
            <Alert
              className={`mt-4 ${
                importResult.success 
                  ? "bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-400" 
                  : "bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-400"
              }`}
            >
              <div className="flex items-center gap-2">
                {importResult.success ? (
                  <LuCheck className="h-4 w-4" />
                ) : (
                  <LuX className="h-4 w-4" />
                )}
                <AlertTitle>
                  {importResult.success ? "Success" : "Error"}
                </AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {importResult.message}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleImport}
          disabled={isImporting || uploadedData.imported}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <LuDownload className="h-4 w-4" />
          {isImporting ? "Importing..." : "Import data"}
        </Button>
      </CardFooter>
    </Card>
  );
};
