"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Bold, 
  Italic, 
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  // Link,
  Image,
  Undo,
  Redo,
  ArrowLeft,
  Type,
  LinkIcon
} from 'lucide-react';
import Link from 'next/link';

export default function RichTextEditorPreview() {
  const [content, setContent] = useState(`
    <h1>Welcome to the Rich Text Editor</h1>
    <p>This is a <strong>powerful</strong> and <em>flexible</em> rich text editor that supports:</p>
    <ul>
      <li>Text formatting (bold, italic, underline)</li>
      <li>Headings and paragraphs</li>
      <li>Lists and blockquotes</li>
      <li>Links and images</li>
      <li>Code blocks and inline code</li>
    </ul>
    <blockquote>
      <p>The editor provides a clean, intuitive interface for content creation.</p>
    </blockquote>
    <p>Try editing this content to see the editor in action!</p>
  `);

  const [wordCount, setWordCount] = useState(42);
  const [characterCount, setCharacterCount] = useState(285);

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    setContent(newContent);
    
    // Update counts (simplified)
    const text = newContent.replace(/<[^>]*>/g, '');
    setCharacterCount(text.length);
    setWordCount(text.split(/\s+/).filter(word => word.length > 0).length);
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs/modules/rich-text-editor">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Docs
            </Link>
          </Button>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Rich Text Editor Preview</h1>
            <p className="text-muted-foreground">Interactive demo of the WYSIWYG editor</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Live Demo</Badge>
          <Badge variant="outline">WYSIWYG</Badge>
        </div>
      </div>

      <Tabs defaultValue="demo" className="space-y-6">
        <TabsList>
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="demo">
          <Card className="w-full">
            {/* Toolbar */}
            <div className="border-b p-2 flex items-center gap-1 flex-wrap">
              {/* Text Formatting */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('bold')}
                className="h-8 w-8 p-0"
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('italic')}
                className="h-8 w-8 p-0"
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('underline')}
                className="h-8 w-8 p-0"
                title="Underline"
              >
                <Underline className="h-4 w-4" />
              </Button>

              <Separator orientation="vertical" className="h-6" />

              {/* Headings */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('formatBlock', 'h1')}
                className="h-8 px-2 text-xs"
                title="Heading 1"
              >
                H1
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('formatBlock', 'h2')}
                className="h-8 px-2 text-xs"
                title="Heading 2"
              >
                H2
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('formatBlock', 'h3')}
                className="h-8 px-2 text-xs"
                title="Heading 3"
              >
                H3
              </Button>

              <Separator orientation="vertical" className="h-6" />

              {/* Lists */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('insertUnorderedList')}
                className="h-8 w-8 p-0"
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('insertOrderedList')}
                className="h-8 w-8 p-0"
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>

              <Separator orientation="vertical" className="h-6" />

              {/* Block Elements */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('formatBlock', 'blockquote')}
                className="h-8 w-8 p-0"
                title="Blockquote"
              >
                <Quote className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('formatBlock', 'pre')}
                className="h-8 w-8 p-0"
                title="Code Block"
              >
                <Code className="h-4 w-4" />
              </Button>

              <Separator orientation="vertical" className="h-6" />

              {/* Links and Images */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const url = prompt('Enter URL:');
                  if (url) execCommand('createLink', url);
                }}
                className="h-8 w-8 p-0"
                title="Insert Link"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const url = prompt('Enter image URL:');
                  if (url) execCommand('insertImage', url);
                }}
                className="h-8 w-8 p-0"
                title="Insert Image"
              >
                <Image className="h-4 w-4" />
              </Button>

              <Separator orientation="vertical" className="h-6" />

              {/* Undo/Redo */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('undo')}
                className="h-8 w-8 p-0"
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand('redo')}
                className="h-8 w-8 p-0"
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            {/* Editor Content */}
            <CardContent className="p-0">
              <div
                contentEditable
                onInput={handleContentChange}
                className="prose prose-sm max-w-none p-4 outline-none focus:ring-0 min-h-[400px]"
                style={{ minHeight: '400px' }}
                dangerouslySetInnerHTML={{ __html: content }}
                suppressContentEditableWarning
              />
            </CardContent>

            {/* Status Bar */}
            <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-muted-foreground bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span>Words:</span>
                  <Badge variant="secondary" className="text-xs">
                    {wordCount}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <span>Characters:</span>
                  <Badge variant="secondary" className="text-xs">
                    {characterCount}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Saved</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Rich Formatting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Complete text formatting with bold, italic, underline, headings, and more.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">WYSIWYG Editing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  What You See Is What You Get editing experience with real-time preview.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Keyboard Shortcuts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Standard keyboard shortcuts for common formatting operations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Export Options</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Export content to HTML, Markdown, JSON, and plain text formats.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Auto-save</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Automatic content saving with configurable intervals and manual save.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Word Counting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Real-time word and character counting with optional limits.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
