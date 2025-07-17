import { getModuleConfig } from '@/config';
import type { 
  EditorContent, 
  EditorConfig, 
  ToolbarConfig,
  ExportOptions,
  ImportOptions,
  ValidationResult,
  EditorValidation
} from '../types';

// ============================================================================
// EDITOR CONFIGURATION
// ============================================================================

const config = getModuleConfig('richTextEditor') as EditorConfig;

export const editorConfig = {
  placeholder: config?.placeholder || 'Start writing...',
  editable: config?.editable ?? true,
  autofocus: config?.autofocus ?? false,
  enableCollaboration: config?.enableCollaboration ?? false,
  enableComments: config?.enableComments ?? false,
  enableVersionHistory: config?.enableVersionHistory ?? false,
  maxLength: config?.maxLength,
  enableWordCount: config?.enableWordCount ?? true,
  enableSpellCheck: config?.enableSpellCheck ?? true,
  enableAutoSave: config?.enableAutoSave ?? false,
  autoSaveInterval: config?.autoSaveInterval || 30000, // 30 seconds
  linkValidation: config?.linkValidation ?? true,
};

export const defaultToolbarConfig: ToolbarConfig = {
  showBold: true,
  showItalic: true,
  showUnderline: true,
  showStrikethrough: true,
  showCode: true,
  showHeadings: true,
  showBulletList: true,
  showOrderedList: true,
  showBlockquote: true,
  showCodeBlock: true,
  showLink: true,
  showImage: true,
  showTable: false,
  showHorizontalRule: true,
  showTextAlign: true,
  showTextColor: false,
  showHighlight: false,
  showUndo: true,
  showRedo: true,
  showFullscreen: false,
  customButtons: [],
};

// ============================================================================
// CONTENT UTILITIES
// ============================================================================

/**
 * Convert HTML to editor JSON format
 */
export function htmlToJSON(html: string): EditorContent {
  // This is a simplified implementation
  // In a real app, you'd use a proper HTML parser
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: html.replace(/<[^>]*>/g, ''), // Strip HTML tags for demo
          },
        ],
      },
    ],
  };
}

/**
 * Convert editor JSON to HTML
 */
export function jsonToHTML(json: EditorContent): string {
  if (!json || !json.content) return '';

  return json.content.map(node => nodeToHTML(node)).join('');
}

/**
 * Convert editor node to HTML
 */
function nodeToHTML(node: any): string {
  if (node.type === 'text') {
    let text = node.text || '';
    
    // Apply marks
    if (node.marks) {
      node.marks.forEach((mark: any) => {
        switch (mark.type) {
          case 'bold':
            text = `<strong>${text}</strong>`;
            break;
          case 'italic':
            text = `<em>${text}</em>`;
            break;
          case 'underline':
            text = `<u>${text}</u>`;
            break;
          case 'strike':
            text = `<s>${text}</s>`;
            break;
          case 'code':
            text = `<code>${text}</code>`;
            break;
          case 'link':
            text = `<a href="${mark.attrs?.href || '#'}">${text}</a>`;
            break;
        }
      });
    }
    
    return text;
  }

  const content = node.content ? node.content.map(nodeToHTML).join('') : '';

  switch (node.type) {
    case 'paragraph':
      return `<p>${content}</p>`;
    case 'heading':
      const level = node.attrs?.level || 1;
      return `<h${level}>${content}</h${level}>`;
    case 'bulletList':
      return `<ul>${content}</ul>`;
    case 'orderedList':
      return `<ol>${content}</ol>`;
    case 'listItem':
      return `<li>${content}</li>`;
    case 'blockquote':
      return `<blockquote>${content}</blockquote>`;
    case 'codeBlock':
      const language = node.attrs?.language || '';
      return `<pre><code class="language-${language}">${content}</code></pre>`;
    case 'hardBreak':
      return '<br>';
    case 'horizontalRule':
      return '<hr>';
    case 'image':
      const src = node.attrs?.src || '';
      const alt = node.attrs?.alt || '';
      const title = node.attrs?.title || '';
      return `<img src="${src}" alt="${alt}" title="${title}">`;
    default:
      return content;
  }
}

/**
 * Convert editor JSON to plain text
 */
export function jsonToText(json: EditorContent): string {
  if (!json || !json.content) return '';

  return json.content.map(node => nodeToText(node)).join('\n');
}

/**
 * Convert editor node to plain text
 */
function nodeToText(node: any): string {
  if (node.type === 'text') {
    return node.text || '';
  }

  if (node.content) {
    return node.content.map(nodeToText).join('');
  }

  return '';
}

/**
 * Convert editor JSON to Markdown
 */
export function jsonToMarkdown(json: EditorContent): string {
  if (!json || !json.content) return '';

  return json.content.map(node => nodeToMarkdown(node)).join('\n\n');
}

/**
 * Convert editor node to Markdown
 */
function nodeToMarkdown(node: any): string {
  if (node.type === 'text') {
    let text = node.text || '';
    
    // Apply marks
    if (node.marks) {
      node.marks.forEach((mark: any) => {
        switch (mark.type) {
          case 'bold':
            text = `**${text}**`;
            break;
          case 'italic':
            text = `*${text}*`;
            break;
          case 'strike':
            text = `~~${text}~~`;
            break;
          case 'code':
            text = `\`${text}\``;
            break;
          case 'link':
            text = `[${text}](${mark.attrs?.href || '#'})`;
            break;
        }
      });
    }
    
    return text;
  }

  const content = node.content ? node.content.map(nodeToMarkdown).join('') : '';

  switch (node.type) {
    case 'paragraph':
      return content;
    case 'heading':
      const level = node.attrs?.level || 1;
      return `${'#'.repeat(level)} ${content}`;
    case 'bulletList':
      return node.content?.map((item: any) => `- ${nodeToMarkdown(item)}`).join('\n') || '';
    case 'orderedList':
      return node.content?.map((item: any, index: number) => `${index + 1}. ${nodeToMarkdown(item)}`).join('\n') || '';
    case 'listItem':
      return content;
    case 'blockquote':
      return `> ${content}`;
    case 'codeBlock':
      const language = node.attrs?.language || '';
      return `\`\`\`${language}\n${content}\n\`\`\``;
    case 'hardBreak':
      return '  \n';
    case 'horizontalRule':
      return '---';
    case 'image':
      const src = node.attrs?.src || '';
      const alt = node.attrs?.alt || '';
      return `![${alt}](${src})`;
    default:
      return content;
  }
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate editor content
 */
export function validateContent(
  content: string,
  json: EditorContent,
  rules: EditorValidation
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required validation
  if (rules.required && (!content || content.trim().length === 0)) {
    errors.push('Content is required');
  }

  // Length validation
  if (rules.minLength && content.length < rules.minLength) {
    errors.push(`Content must be at least ${rules.minLength} characters`);
  }

  if (rules.maxLength && content.length > rules.maxLength) {
    errors.push(`Content must not exceed ${rules.maxLength} characters`);
  }

  // Custom validation
  if (rules.customValidator) {
    const customError = rules.customValidator(content, json);
    if (customError) {
      errors.push(customError);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

/**
 * Export content in various formats
 */
export async function exportContent(
  json: EditorContent,
  options: ExportOptions
): Promise<string | Blob> {
  switch (options.format) {
    case 'html':
      return jsonToHTML(json);
    
    case 'markdown':
      return jsonToMarkdown(json);
    
    case 'json':
      return JSON.stringify(json, null, 2);
    
    case 'text':
      return jsonToText(json);
    
    case 'pdf':
      // This would require a PDF generation library
      throw new Error('PDF export not implemented');
    
    case 'docx':
      // This would require a DOCX generation library
      throw new Error('DOCX export not implemented');
    
    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }
}

/**
 * Import content from various formats
 */
export async function importContent(
  data: string | File,
  options: ImportOptions
): Promise<EditorContent> {
  let content: string;

  if (data instanceof File) {
    content = await data.text();
  } else {
    content = data;
  }

  switch (options.format) {
    case 'html':
      return htmlToJSON(content);
    
    case 'markdown':
      // This would require a Markdown parser
      return htmlToJSON(content); // Simplified
    
    case 'json':
      try {
        return JSON.parse(content);
      } catch {
        throw new Error('Invalid JSON format');
      }
    
    case 'text':
      return {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: content,
              },
            ],
          },
        ],
      };
    
    case 'docx':
      // This would require a DOCX parser
      throw new Error('DOCX import not implemented');
    
    default:
      throw new Error(`Unsupported import format: ${options.format}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Count words in content
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Count characters in content
 */
export function countCharacters(text: string): number {
  return text.length;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `editor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sanitize HTML content
 */
export function sanitizeHTML(html: string): string {
  // This is a basic implementation
  // In production, use a proper HTML sanitizer like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Validate URL
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
