'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadButtonProps {
  fileUrl: string;
  fileName: string;
  orderId: string;
}

export function DownloadButton({ fileUrl, fileName, orderId }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Increment download count
      await fetch(`/api/download/${orderId}`, {
        method: 'POST',
      });

      // Trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={loading} size="sm">
      <Download className="mr-2 h-4 w-4" />
      {loading ? 'Downloading...' : 'Download'}
    </Button>
  );
}
