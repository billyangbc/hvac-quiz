'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const DownloadCsvTemplate = () => {
  const handleDownload = () => {
    // Create a link to the CSV template in the public directory
    const link = document.createElement('a');
    link.href = '/data/template/csv-template.csv';
    link.download = 'csv-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mb-4 flex justify-end">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDownload}
        className="flex items-center gap-1 text-xs"
      >
        <Download className="h-3.5 w-3.5" />
        Download CSV Template
      </Button>
    </div>
  );
};
