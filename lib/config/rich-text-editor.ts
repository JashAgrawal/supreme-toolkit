/**
 * Rich Text Editor Configuration
 * 
 * Configure editor settings and features
 */

export interface RichTextEditorConfig {
  placeholder?: string;
  enableWordCount?: boolean;
  enableSpellCheck?: boolean;
  enableAutoSave?: boolean;
  autoSaveInterval?: number; // in milliseconds
  maxLength?: number;
  linkValidation?: boolean;
  imageUploadHandler?: (file: File) => Promise<string>;
}

export const defaultRichTextEditorConfig: RichTextEditorConfig = {
  placeholder: 'Start writing...',
  enableWordCount: true,
  enableSpellCheck: true,
  enableAutoSave: true,
  autoSaveInterval: 30000, // 30 seconds
  linkValidation: true,
};

/**
 * Get rich text editor configuration with defaults
 */
export function getRichTextEditorConfig(userConfig?: Partial<RichTextEditorConfig>): RichTextEditorConfig {
  return {
    ...defaultRichTextEditorConfig,
    ...userConfig,
  };
}

/**
 * Validate rich text editor configuration
 */
export function validateRichTextEditorConfig(config: RichTextEditorConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (config.autoSaveInterval && config.autoSaveInterval < 1000) {
    errors.push('autoSaveInterval must be at least 1000ms (1 second)');
  }
  
  if (config.maxLength && config.maxLength < 1) {
    errors.push('maxLength must be greater than 0');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
