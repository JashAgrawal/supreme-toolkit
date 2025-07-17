"use client";

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { EditorStatusBarProps } from '../../types';
import { cn } from '@/lib/utils';

export function EditorStatusBar({
  editor,
  showWordCount = true,
  showCharacterCount = true,
  maxLength,
  className,
}: EditorStatusBarProps) {
  if (!editor) return null;

  const wordCount = editor.wordCount || 0;
  const characterCount = editor.characterCount || 0;
  const isNearLimit = maxLength && characterCount > maxLength * 0.9;
  const isOverLimit = maxLength && characterCount > maxLength;

  return (
    <div className={cn(
      "border-t px-4 py-2 flex items-center justify-between text-xs text-muted-foreground bg-muted/30",
      className
    )}>
      <div className="flex items-center gap-3">
        {/* Word Count */}
        {showWordCount && (
          <div className="flex items-center gap-1">
            <span>Words:</span>
            <Badge variant="secondary" className="text-xs">
              {wordCount.toLocaleString()}
            </Badge>
          </div>
        )}

        {/* Character Count */}
        {showCharacterCount && (
          <div className="flex items-center gap-1">
            <span>Characters:</span>
            <Badge 
              variant={isOverLimit ? "destructive" : isNearLimit ? "outline" : "secondary"}
              className={cn(
                "text-xs",
                isNearLimit && !isOverLimit && "border-orange-500 text-orange-600",
              )}
            >
              {characterCount.toLocaleString()}
              {maxLength && `/${maxLength.toLocaleString()}`}
            </Badge>
          </div>
        )}

        {(showWordCount || showCharacterCount) && (
          <Separator orientation="vertical" className="h-4" />
        )}

        {/* Editor State */}
        <div className="flex items-center gap-2">
          {editor.isEmpty && (
            <Badge variant="outline" className="text-xs">
              Empty
            </Badge>
          )}
          
          {!editor.isEditable && (
            <Badge variant="outline" className="text-xs">
              Read-only
            </Badge>
          )}
        </div>
      </div>

      {/* Right Side Info */}
      <div className="flex items-center gap-3">
        {/* Undo/Redo Status */}
        <div className="flex items-center gap-2 text-xs">
          {editor.canUndo && (
            <span className="text-blue-600">Can undo</span>
          )}
          {editor.canRedo && (
            <span className="text-blue-600">Can redo</span>
          )}
        </div>

        {/* Save Status */}
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Saved</span>
        </div>
      </div>
    </div>
  );
}
