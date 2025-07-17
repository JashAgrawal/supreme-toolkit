"use client";

import { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useRichTextEditor } from '../../hooks/use-rich-text-editor';
import { EditorToolbar } from './editor-toolbar';
import { EditorStatusBar } from './editor-status-bar';
import { defaultToolbarConfig } from '../../lib/editor';
import type { RichTextEditorProps } from '../../types';
import { cn } from '@/lib/utils';

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  editable = true,
  autofocus = false,
  maxLength,
  className,
  toolbarConfig = defaultToolbarConfig,
  editorConfig,
  showWordCount = true,
  showCharacterCount = true,
  enableAutoSave = false,
  autoSaveInterval = 30000,
  onSave,
  onError,
  imageUploadHandler,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    editor,
    content,
    jsonContent,
    wordCount,
    characterCount,
    isEditable,
    isEmpty,
    canUndo,
    canRedo,
    setContent,
    focus,
  } = useRichTextEditor({
    initialContent: value,
    placeholder,
    editable,
    autofocus,
    maxLength,
    enableAutoSave,
    autoSaveInterval,
    onUpdate: (htmlContent, jsonContent) => {
      onChange?.(htmlContent, jsonContent);
    },
    onSave,
    onError,
    imageUploadHandler,
  });

  // Update content when value prop changes
  useEffect(() => {
    if (value !== undefined && value !== content) {
      setContent(value);
    }
  }, [value, content, setContent]);

  // Handle content editable changes
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    if (newContent !== content) {
      // This would trigger the editor update in a real implementation
      // For now, we'll just update the display
    }
  };

  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const html = e.clipboardData.getData('text/html');
    
    // Insert content at cursor position
    if (html) {
      document.execCommand('insertHTML', false, html);
    } else {
      document.execCommand('insertText', false, text);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          editor.commands.toggleBold();
          break;
        case 'i':
          e.preventDefault();
          editor.commands.toggleItalic();
          break;
        case 'u':
          e.preventDefault();
          editor.commands.toggleUnderline();
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            editor.commands.redo();
          } else {
            editor.commands.undo();
          }
          break;
        case 's':
          e.preventDefault();
          onSave?.(content, jsonContent!);
          break;
      }
    }
  };

  // Auto-focus
  useEffect(() => {
    if (autofocus && contentRef.current) {
      contentRef.current.focus();
    }
  }, [autofocus]);

  return (
    <Card className={cn("w-full", className)}>
      {/* Toolbar */}
      <EditorToolbar editor={editor} config={toolbarConfig} />

      {/* Editor Content */}
      <CardContent className="p-0">
        <div
          ref={editorRef}
          className="relative min-h-[200px] max-h-[600px] overflow-y-auto"
        >
          <div
            ref={contentRef}
            contentEditable={isEditable}
            onInput={handleInput}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            className={cn(
              "prose prose-sm max-w-none p-4 outline-none",
              "focus:ring-0 focus:outline-none",
              !isEditable && "cursor-not-allowed opacity-60"
            )}
            style={{
              minHeight: '200px',
            }}
            dangerouslySetInnerHTML={{
              __html: content || `<p class="text-muted-foreground">${placeholder}</p>`
            }}
            suppressContentEditableWarning
          />

          {/* Character limit indicator */}
          {maxLength && (
            <div className="absolute bottom-2 right-2">
              <span
                className={cn(
                  "text-xs",
                  characterCount > maxLength * 0.9 && "text-orange-500",
                  characterCount > maxLength && "text-red-500"
                )}
              >
                {characterCount}/{maxLength}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Status Bar */}
      {(showWordCount || showCharacterCount) && (
        <EditorStatusBar
          editor={editor}
          showWordCount={showWordCount}
          showCharacterCount={showCharacterCount}
          maxLength={maxLength}
        />
      )}
    </Card>
  );
}
