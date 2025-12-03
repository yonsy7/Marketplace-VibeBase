"use client";

import { Button } from "@/components/ui/button";
import {
  EditorContent,
  JSONContent,
  useEditor,
  type Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

export const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-5">
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        variant={
          editor.isActive("heading", { level: 1 }) ? "default" : "secondary"
        }
        type="button"
      >
        H1
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        variant={
          editor.isActive("heading", { level: 2 }) ? "default" : "secondary"
        }
        type="button"
      >
        H2
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        variant={
          editor.isActive("heading", { level: 3 }) ? "default" : "secondary"
        }
        type="button"
      >
        H3
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        variant={editor.isActive("bold") ? "default" : "secondary"}
        type="button"
      >
        Bold
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        variant={editor.isActive("italic") ? "default" : "secondary"}
        type="button"
      >
        Italic
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        variant={editor.isActive("strike") ? "default" : "secondary"}
        type="button"
      >
        Strike
      </Button>
    </div>
  );
};

export function TipTapEditor({
  setJson,
  json,
}: {
  setJson: any;
  json: JSONContent | null;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: json,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[150px]  prose prose-sm sm:prose-base",
      },
    },
    onUpdate: ({ editor }) => {
      setJson(editor.getJSON());
    },
  });

  useEffect(() => {
    if (editor && json) {
      editor.commands.setContent(json);
    }
  }, [editor, json]);

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="rounded-lg border p-2 min-h-[150px] mt-2"
      />
    </div>
  );
}

// Simple Editor component for read-only or basic editing
export function Editor({
  content,
  onChange,
  editable = true,
}: {
  content: string | JSONContent;
  onChange?: (content: JSONContent) => void;
  editable?: boolean;
}) {
  const jsonContent = typeof content === 'string' 
    ? (content ? JSON.parse(content) : null)
    : content;

  const editor = useEditor({
    extensions: [StarterKit],
    content: jsonContent,
    editable,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[150px] prose prose-sm sm:prose-base",
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getJSON());
      }
    },
  });

  useEffect(() => {
    if (editor && jsonContent) {
      editor.commands.setContent(jsonContent);
    }
  }, [editor, jsonContent]);

  if (!editable) {
    return <EditorContent editor={editor} />;
  }

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="rounded-lg border p-2 min-h-[150px] mt-2"
      />
    </div>
  );
}
