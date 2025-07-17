"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Link,
  Image,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Maximize,
} from 'lucide-react';
import type { EditorToolbarProps } from '../../types';
import { cn } from '@/lib/utils';

export function EditorToolbar({
  editor,
  config,
  className,
}: EditorToolbarProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);

  if (!editor) return null;

  const handleSetLink = () => {
    if (linkUrl) {
      editor.commands.setLink(linkUrl);
      setLinkUrl('');
      setIsLinkPopoverOpen(false);
    }
  };

  const handleInsertImage = () => {
    if (imageUrl) {
      editor.commands.insertImage(imageUrl, imageAlt);
      setImageUrl('');
      setImageAlt('');
      setIsImagePopoverOpen(false);
    }
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    title 
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  );

  return (
    <div className={cn("border-b p-2 flex items-center gap-1 flex-wrap", className)}>
      {/* Text Formatting */}
      {config?.showBold && (
        <ToolbarButton
          onClick={() => editor.commands.toggleBold()}
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
      )}

      {config?.showItalic && (
        <ToolbarButton
          onClick={() => editor.commands.toggleItalic()}
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
      )}

      {config?.showUnderline && (
        <ToolbarButton
          onClick={() => editor.commands.toggleUnderline()}
          isActive={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </ToolbarButton>
      )}

      {config?.showStrikethrough && (
        <ToolbarButton
          onClick={() => editor.commands.toggleStrike()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
      )}

      {config?.showCode && (
        <ToolbarButton
          onClick={() => editor.commands.toggleCode()}
          isActive={editor.isActive('code')}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
      )}

      {(config?.showBold || config?.showItalic || config?.showUnderline || config?.showStrikethrough || config?.showCode) && (
        <Separator orientation="vertical" className="h-6" />
      )}

      {/* Headings */}
      {config?.showHeadings && (
        <Select
          value={
            editor.isActive('heading', { level: 1 }) ? '1' :
            editor.isActive('heading', { level: 2 }) ? '2' :
            editor.isActive('heading', { level: 3 }) ? '3' :
            'paragraph'
          }
          onValueChange={(value) => {
            if (value === 'paragraph') {
              editor.commands.setParagraph();
            } else {
              editor.commands.setHeading(parseInt(value));
            }
          }}
        >
          <SelectTrigger className="w-32 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">Paragraph</SelectItem>
            <SelectItem value="1">Heading 1</SelectItem>
            <SelectItem value="2">Heading 2</SelectItem>
            <SelectItem value="3">Heading 3</SelectItem>
          </SelectContent>
        </Select>
      )}

      {config?.showHeadings && (
        <Separator orientation="vertical" className="h-6" />
      )}

      {/* Lists */}
      {config?.showBulletList && (
        <ToolbarButton
          onClick={() => editor.commands.toggleBulletList()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
      )}

      {config?.showOrderedList && (
        <ToolbarButton
          onClick={() => editor.commands.toggleOrderedList()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
      )}

      {(config?.showBulletList || config?.showOrderedList) && (
        <Separator orientation="vertical" className="h-6" />
      )}

      {/* Block Elements */}
      {config?.showBlockquote && (
        <ToolbarButton
          onClick={() => editor.commands.toggleBlockquote()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
      )}

      {config?.showCodeBlock && (
        <ToolbarButton
          onClick={() => editor.commands.toggleCodeBlock()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <Code2 className="h-4 w-4" />
        </ToolbarButton>
      )}

      {(config?.showBlockquote || config?.showCodeBlock) && (
        <Separator orientation="vertical" className="h-6" />
      )}

      {/* Link */}
      {config?.showLink && (
        <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={editor.isActive('link') ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title="Insert Link"
            >
              <Link className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSetLink();
                  }
                }}
              />
              <div className="flex gap-2">
                <Button onClick={handleSetLink} size="sm">
                  Insert Link
                </Button>
                {editor.isActive('link') && (
                  <Button
                    onClick={() => {
                      editor.commands.unsetLink();
                      setIsLinkPopoverOpen(false);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Remove Link
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Image */}
      {config?.showImage && (
        <Popover open={isImagePopoverOpen} onOpenChange={setIsImagePopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Insert Image"
            >
              <Image className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Description of the image"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleInsertImage();
                  }
                }}
              />
              <Button onClick={handleInsertImage} size="sm">
                Insert Image
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Horizontal Rule */}
      {config?.showHorizontalRule && (
        <ToolbarButton
          onClick={() => editor.commands.setHorizontalRule()}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>
      )}

      {(config?.showLink || config?.showImage || config?.showHorizontalRule) && (
        <Separator orientation="vertical" className="h-6" />
      )}

      {/* Text Alignment */}
      {config?.showTextAlign && (
        <>
          <ToolbarButton
            onClick={() => editor.commands.setTextAlign('left')}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.commands.setTextAlign('center')}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.commands.setTextAlign('right')}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
          <Separator orientation="vertical" className="h-6" />
        </>
      )}

      {/* Undo/Redo */}
      {(config?.showUndo || config?.showRedo) && (
        <>
          {config?.showUndo && (
            <ToolbarButton
              onClick={() => editor.commands.undo()}
              disabled={!editor.can().undo()}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </ToolbarButton>
          )}
          {config?.showRedo && (
            <ToolbarButton
              onClick={() => editor.commands.redo()}
              disabled={!editor.can().redo()}
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo className="h-4 w-4" />
            </ToolbarButton>
          )}
          <Separator orientation="vertical" className="h-6" />
        </>
      )}

      {/* Fullscreen */}
      {config?.showFullscreen && (
        <ToolbarButton
          onClick={() => {
            // Fullscreen implementation would go here
            console.log('Toggle fullscreen');
          }}
          title="Fullscreen"
        >
          <Maximize className="h-4 w-4" />
        </ToolbarButton>
      )}

      {/* Custom Buttons */}
      {config?.customButtons?.map((button) => (
        <ToolbarButton
          key={button.id}
          onClick={() => button.action(editor)}
          isActive={button.isActive?.(editor)}
          disabled={button.isDisabled?.(editor)}
          title={button.tooltip || button.label}
        >
          {button.icon}
        </ToolbarButton>
      ))}
    </div>
  );
}
