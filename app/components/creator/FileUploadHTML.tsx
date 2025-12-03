'use client';

import { useState } from 'react';
import { UploadDropzone } from '@/app/lib/uploadthing';
import { X, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FileUploadHTMLProps {
  files: Array<{ url: string; type: string; name: string; isPreview?: boolean }>;
  onChange: (files: Array<{ url: string; type: string; name: string; isPreview?: boolean }>) => void;
}

export function FileUploadHTML({ files, onChange }: FileUploadHTMLProps) {
  const handleUploadComplete = (res: Array<{ url: string; name: string; size: number }>) => {
    const newFiles = res.map((file) => ({
      url: file.url,
      type: file.name.endsWith('.html') ? 'HTML' : file.name.endsWith('.css') ? 'CSS' : file.name.endsWith('.js') ? 'JS' : 'ASSET',
      name: file.name,
      isPreview: false,
    }));
    onChange([...files, ...newFiles]);
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const handleSetPreview = (index: number) => {
    const newFiles = files.map((file, i) => ({
      ...file,
      isPreview: i === index && file.type === 'HTML',
    }));
    onChange(newFiles);
  };

  const htmlFiles = files.filter((f) => f.type === 'HTML');
  const hasPreview = files.some((f) => f.isPreview);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Upload HTML, CSS, JS files and assets. At least one HTML file is required.
        </p>
        {!hasPreview && htmlFiles.length > 0 && (
          <p className="text-sm text-amber-600 mb-2">
            Please set one HTML file as preview
          </p>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <File className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.type}</p>
                </div>
                {file.isPreview && (
                  <Badge variant="default">Preview</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {file.type === 'HTML' && !file.isPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetPreview(index)}
                  >
                    Set as Preview
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <UploadDropzone
        endpoint="productFileUpload"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={(error: Error) => {
          console.error('Upload error:', error);
        }}
      />
    </div>
  );
}
