'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useMemo } from 'react';

interface TemplateDetailsProps {
  template: {
    longDesc?: string | any;
    files: Array<{ fileName: string; fileType: string; fileSize?: number }>;
  };
}

export function TemplateDetails({ template }: TemplateDetailsProps) {
  const content = useMemo(() => {
    return typeof template.longDesc === 'string' 
      ? JSON.parse(template.longDesc || '{}')
      : template.longDesc || {};
  }, [template.longDesc]);

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false,
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Description</h2>
        {template.longDesc ? (
          <div className="prose max-w-none">
            <EditorContent editor={editor} />
          </div>
        ) : (
          <p className="text-muted-foreground">No description available.</p>
        )}
      </div>

      {template.files.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Files Included</h2>
          <ul className="space-y-2">
            {template.files.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">{file.fileName}</span>
                <span className="text-xs text-muted-foreground">
                  {file.fileType} {file.fileSize ? `(${(file.fileSize / 1024).toFixed(2)} KB)` : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
