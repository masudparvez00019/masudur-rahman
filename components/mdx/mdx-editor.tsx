"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Code, ImageIcon } from "lucide-react";
import MDXRenderer from "./mdx-renderer";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";

interface MDXEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

export default function MDXEditor({
  initialContent,
  onChange,
  placeholder = "Write your content here...",
  minHeight = "200px",
  onImageUpload,
}: MDXEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [compiledSource, setCompiledSource] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  // Compile MDX when content changes or when switching to preview tab
  useEffect(() => {
    if (activeTab === "preview" && content) {
      compileContent();
    }
  }, [content, activeTab]);

  const compileContent = async () => {
    if (!content.trim()) {
      setCompiledSource(null);
      return;
    }

    setIsCompiling(true);
    try {
      const result = await compile(content, {
        outputFormat: "function-body",
        development: false,
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypePrism],
      });
      setCompiledSource(String(result));
    } catch (error) {
      console.error("Error compiling MDX:", error);
      setCompiledSource(
        `<p>Error compiling MDX: ${
          error instanceof Error ? error.message : String(error)
        }</p>`
      );
    } finally {
      setIsCompiling(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange(newContent);
  };

  const insertMarkdown = (markdown: string) => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent =
      content.substring(0, start) + markdown + content.substring(end);

    setContent(newContent);
    onChange(newContent);

    // Set cursor position after the inserted markdown
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + markdown.length;
      textarea.selectionEnd = start + markdown.length;
    }, 0);
  };

  const handleInsertMarkdown = useCallback(
    (markdown: string) => {
      const textarea = document.querySelector("textarea");
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent =
        content.substring(0, start) + markdown + content.substring(end);

      setContent(newContent);
      onChange(newContent);

      // Set cursor position after the inserted markdown
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + markdown.length;
        textarea.selectionEnd = start + markdown.length;
      }, 0);
    },
    [content, onChange]
  );

  const handleImageUploadClick = useCallback(async () => {
    if (!onImageUpload) {
      handleInsertMarkdown(
        "![Alt text](/placeholder.svg?height=200&width=400)"
      );
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const imageUrl = await onImageUpload(file);
        handleInsertMarkdown(`![${file.name}](${imageUrl})`);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    };

    input.click();
  }, [onImageUpload, handleInsertMarkdown]);

  return (
    <div className="border rounded-md overflow-hidden">
      <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between border-b px-4 py-2">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertMarkdown("```js\n// Your code here\n```")}
            >
              <Code className="h-4 w-4 mr-2" />
              Code
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImageUploadClick}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Image
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                insertMarkdown(`
<Alert type="info">
Important information here
</Alert>
`)
              }
            >
              Alert
            </Button>
          </div>
        </div>

        <TabsContent value="edit" className="p-0">
          <Textarea
            value={content}
            onChange={handleContentChange}
            placeholder={placeholder}
            className="font-mono resize-none border-0 rounded-none focus-visible:ring-0"
            style={{ minHeight }}
          />
        </TabsContent>

        <TabsContent value="preview" className="p-6">
          {isCompiling ? (
            <div
              className="flex items-center justify-center"
              style={{ minHeight }}
            >
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : compiledSource ? (
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <MDXRenderer source={compiledSource} />
            </div>
          ) : (
            <div
              className="text-muted-foreground text-center"
              style={{ minHeight }}
            >
              No content to preview
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
