'use client';

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { uploadFileToS3 } from "@/lib/actions/dashboard/import-actions";
import { LuImport, LuCheck, LuX, LuFilePen, LuExternalLink } from "react-icons/lu";
import { UploadedData } from "./UploadedData";

export const ImportData = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    objectKey?: string;
    url?: string;
    uploadedData?: {
      id?: string;
      bucketName: string;
      fileKey: string;
      serverType?: string;
      serverUrl?: string;
      imported?: boolean;
    };
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setUploadResult(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0] || null;
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile);
      setUploadResult(null);
    } else {
      setUploadResult({
        success: false,
        message: "Only CSV files are allowed"
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadFileToS3(formData);
      setUploadResult(result);
    } catch (error) {
      setUploadResult({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <LuImport className="h-5 w-5" />
          Import CSV Data
        </CardTitle>
        <CardDescription>
          Upload CSV files to import data into the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            file ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20" : "border-gray-300 dark:border-gray-700"
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <LuFilePen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                {file ? file.name : "Drag and drop your CSV file here"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {file 
                  ? `${(file.size / 1024 / 1024).toFixed(2)} MB` 
                  : "CSV files only, max 10MB"}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs"
              >
                Select File
              </Button>
              {file && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetForm}
                  className="text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {uploadResult && (
          <Alert
            className={`mt-4 ${
              uploadResult.success 
                ? "bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-400" 
                : "bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {uploadResult.success ? (
                <LuCheck className="h-4 w-4" />
              ) : (
                <LuX className="h-4 w-4" />
              )}
              <AlertTitle>
                {uploadResult.success ? "Success" : "Error"}
              </AlertTitle>
            </div>
            <AlertDescription className="mt-2">
              {uploadResult.message}
              {/*
              {uploadResult.success && uploadResult.url && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <LuExternalLink className="h-4 w-4" />
                  <a 
                    href={uploadResult.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    View uploaded file
                  </a>
                </div>
              )}
              */}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isUploading ? "Uploading..." : "Upload to S3"}
        </Button>
      </CardFooter>
    </Card>
    {uploadResult?.success && uploadResult.uploadedData && (
      <UploadedData uploadedData={uploadResult.uploadedData} />
    )}
    </>
  );
};
