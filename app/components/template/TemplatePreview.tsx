'use client';

import { TechStack } from '@prisma/client';

interface TemplatePreviewProps {
  template: {
    techStack: TechStack;
    previewFileId?: string;
    liveDemoUrl?: string;
    files: Array<{ fileUrl: string; fileType: string; isPreview: boolean }>;
  };
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  const previewFile = template.files.find((f) => f.isPreview && f.fileType === 'HTML');

  if (template.techStack === 'HTML' && previewFile) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Preview</h2>
        <div className="border rounded-lg overflow-hidden">
          <iframe
            src={previewFile.fileUrl}
            className="w-full h-[600px] border-0"
            sandbox="allow-scripts allow-same-origin"
            title="Template Preview"
          />
        </div>
      </div>
    );
  }

  if (
    (template.techStack === 'REACT_VITE' || template.techStack === 'NEXTJS') &&
    template.liveDemoUrl
  ) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Live Demo</h2>
          <a
            href={template.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Open in new tab →
          </a>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <iframe
            src={template.liveDemoUrl}
            className="w-full h-[600px] border-0"
            title="Live Demo"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Preview</h2>
      <div className="border rounded-lg p-12 text-center text-muted-foreground">
        <p>No preview available for this template.</p>
      </div>
    </div>
  );
}
