"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  htmlToJSON, 
  jsonToHTML, 
  jsonToText, 
  countWords, 
  countCharacters,
  editorConfig 
} from '../lib/editor';
import type { 
  EditorContent, 
  UseRichTextEditorOptions, 
  UseRichTextEditorReturn 
} from '../types';

export function useRichTextEditor({
  initialContent = '',
  placeholder,
  editable = true,
  autofocus = false,
  maxLength,
  enableAutoSave = false,
  autoSaveInterval = 30000,
  onUpdate,
  onSave,
  onError,
  imageUploadHandler,
}: UseRichTextEditorOptions): UseRichTextEditorReturn {
  const [content, setContent] = useState<string>('');
  const [jsonContent, setJsonContent] = useState<EditorContent | null>(null);
  const [isEditable, setIsEditable] = useState(editable);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  const editorRef = useRef<any>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const historyRef = useRef<{ content: string; json: EditorContent }[]>([]);
  const historyIndexRef = useRef(0);

  // Initialize content
  useEffect(() => {
    if (initialContent) {
      if (typeof initialContent === 'string') {
        setContent(initialContent);
        const json = htmlToJSON(initialContent);
        setJsonContent(json);
        updateCounts(initialContent);
      } else {
        const html = jsonToHTML(initialContent);
        setContent(html);
        setJsonContent(initialContent);
        updateCounts(html);
      }
    }
  }, [initialContent]);

  // Update word and character counts
  const updateCounts = useCallback((htmlContent: string) => {
    const text = htmlContent.replace(/<[^>]*>/g, ''); // Strip HTML
    setWordCount(countWords(text));
    setCharacterCount(countCharacters(text));
  }, []);

  // Handle content updates
  const handleUpdate = useCallback((newContent: string, newJsonContent: EditorContent) => {
    // Check max length
    if (maxLength && newContent.length > maxLength) {
      onError?.('Content exceeds maximum length');
      return;
    }

    setContent(newContent);
    setJsonContent(newJsonContent);
    updateCounts(newContent);

    // Add to history
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push({ content: newContent, json: newJsonContent });
    historyIndexRef.current = historyRef.current.length - 1;

    // Update undo/redo state
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);

    // Call update callback
    onUpdate?.(newContent, newJsonContent);

    // Handle auto-save
    if (enableAutoSave) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        onSave?.(newContent, newJsonContent);
      }, autoSaveInterval);
    }
  }, [maxLength, onError, onUpdate, onSave, enableAutoSave, autoSaveInterval, updateCounts]);

  // Set content programmatically
  const setContentProgrammatically = useCallback((newContent: string | EditorContent) => {
    if (typeof newContent === 'string') {
      const json = htmlToJSON(newContent);
      handleUpdate(newContent, json);
    } else {
      const html = jsonToHTML(newContent);
      handleUpdate(html, newContent);
    }
  }, [handleUpdate]);

  // Get content in various formats
  const getHTML = useCallback(() => content, [content]);
  
  const getJSON = useCallback(() => jsonContent || { type: 'doc', content: [] }, [jsonContent]);
  
  const getText = useCallback(() => {
    return jsonContent ? jsonToText(jsonContent) : '';
  }, [jsonContent]);

  // Editor actions
  const focus = useCallback(() => {
    editorRef.current?.commands?.focus();
  }, []);

  const blur = useCallback(() => {
    editorRef.current?.commands?.blur();
  }, []);

  const undo = useCallback(() => {
    if (canUndo && historyIndexRef.current > 0) {
      historyIndexRef.current--;
      const historyItem = historyRef.current[historyIndexRef.current];
      
      setContent(historyItem.content);
      setJsonContent(historyItem.json);
      updateCounts(historyItem.content);
      
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(true);
    }
  }, [canUndo, updateCounts]);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      const historyItem = historyRef.current[historyIndexRef.current];
      
      setContent(historyItem.content);
      setJsonContent(historyItem.json);
      updateCounts(historyItem.content);
      
      setCanUndo(true);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  }, [updateCounts]);

  const clearContent = useCallback(() => {
    const emptyContent = '';
    const emptyJson: EditorContent = { type: 'doc', content: [] };
    handleUpdate(emptyContent, emptyJson);
  }, [handleUpdate]);

  // Cleanup auto-save timeout
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Mock editor object for compatibility
  const mockEditor = {
    commands: {
      focus: focus,
      blur: blur,
      undo: undo,
      redo: redo,
      clearContent: clearContent,
      setContent: setContentProgrammatically,
      toggleBold: () => {
        // Mock implementation
        console.log('Toggle bold');
      },
      toggleItalic: () => {
        // Mock implementation
        console.log('Toggle italic');
      },
      toggleUnderline: () => {
        // Mock implementation
        console.log('Toggle underline');
      },
      toggleStrike: () => {
        // Mock implementation
        console.log('Toggle strike');
      },
      toggleCode: () => {
        // Mock implementation
        console.log('Toggle code');
      },
      setHeading: (level: number) => {
        // Mock implementation
        console.log('Set heading', level);
      },
      toggleBulletList: () => {
        // Mock implementation
        console.log('Toggle bullet list');
      },
      toggleOrderedList: () => {
        // Mock implementation
        console.log('Toggle ordered list');
      },
      toggleBlockquote: () => {
        // Mock implementation
        console.log('Toggle blockquote');
      },
      toggleCodeBlock: () => {
        // Mock implementation
        console.log('Toggle code block');
      },
      setLink: (url: string) => {
        // Mock implementation
        console.log('Set link', url);
      },
      unsetLink: () => {
        // Mock implementation
        console.log('Unset link');
      },
      insertImage: (src: string, alt?: string) => {
        // Mock implementation
        console.log('Insert image', src, alt);
      },
      setHorizontalRule: () => {
        // Mock implementation
        console.log('Insert horizontal rule');
      },
    },
    isActive: (name: string) => {
      // Mock implementation
      return false;
    },
    can: () => ({
      undo: () => canUndo,
      redo: () => canRedo,
    }),
    getHTML: getHTML,
    getJSON: getJSON,
    getText: getText,
    isEmpty: content.trim().length === 0,
    isEditable: isEditable,
  };

  editorRef.current = mockEditor;

  return {
    editor: mockEditor,
    content,
    jsonContent,
    wordCount,
    characterCount,
    isEditable,
    isEmpty: content.trim().length === 0,
    canUndo,
    canRedo,
    setContent: setContentProgrammatically,
    getHTML,
    getJSON,
    getText,
    focus,
    blur,
    undo,
    redo,
    clearContent,
    setEditable: setIsEditable,
  };
}
