'use client';

import { File, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DownloadButton } from './DownloadButton';

interface FileListProps {
  files: Array<{
    id: string;
    fileName: string;
    fileType: string;
    fileUrl: string;
    fileSize?: number;
  }>;
  orderId: string;
}

export function FileList({ files, orderId }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No files available for download
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center gap-3">
            <File className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{file.fileName}</p>
              <p className="text-sm text-muted-foreground">
                {file.fileType}
                {file.fileSize && ` • ${(file.fileSize / 1024).toFixed(2)} KB`}
              </p>
            </div>
          </div>
          <DownloadButton fileUrl={file.fileUrl} fileName={file.fileName} orderId={orderId} />
        </div>
      ))}
    </div>
  );
}
