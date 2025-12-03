'use client';

import { useState } from 'react';
import { UploadDropzone } from '@/app/lib/uploadthing';
import { X, FileArchive } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadZipProps {
  files: Array<{ url: string; type: string; name: string }>;
  onChange: (files: Array<{ url: string; type: string; name: string }>) => void;
}

export function FileUploadZip({ files, onChange }: FileUploadZipProps) {
  const handleUploadComplete = (res: Array<{ url: string; name: string }>) => {
    const newFiles = res.map((file) => ({
      url: file.url,
      type: 'PROJECT_ZIP',
      name: file.name,
    }));
    onChange(newFiles);
  };

  const handleRemove = () => {
    onChange([]);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Upload a ZIP file containing your project. A live demo URL is also required.
        </p>
      </div>

      {files.length > 0 && (
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <FileArchive className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{files[0].name}</p>
              <p className="text-xs text-muted-foreground">ZIP Archive</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {files.length === 0 && (
        <UploadDropzone
          endpoint="productFileUpload"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={(error: Error) => {
            console.error('Upload error:', error);
          }}
        />
      )}
    </div>
  );
}
