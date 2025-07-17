// ============================================================================
// RICH TEXT EDITOR TYPES
// ============================================================================

export interface EditorContent {
  type: 'doc';
  content: EditorNode[];
}

export interface EditorNode {
  type: string;
  attrs?: Record<string, any>;
  content?: EditorNode[];
  marks?: EditorMark[];
  text?: string;
}

export interface EditorMark {
  type: string;
  attrs?: Record<string, any>;
}

export interface EditorConfig {
  placeholder?: string;
  editable?: boolean;
  autofocus?: boolean;
  enableCollaboration?: boolean;
  enableComments?: boolean;
  enableVersionHistory?: boolean;
  maxLength?: number;
  enableWordCount?: boolean;
  enableSpellCheck?: boolean;
  enableAutoSave?: boolean;
  autoSaveInterval?: number; // in milliseconds
  uploadUrl?: string;
  imageUploadHandler?: (file: File) => Promise<string>;
  linkValidation?: boolean;
  customExtensions?: any[];
}

export interface ToolbarConfig {
  showBold?: boolean;
  showItalic?: boolean;
  showUnderline?: boolean;
  showStrikethrough?: boolean;
  showCode?: boolean;
  showHeadings?: boolean;
  showBulletList?: boolean;
  showOrderedList?: boolean;
  showBlockquote?: boolean;
  showCodeBlock?: boolean;
  showLink?: boolean;
  showImage?: boolean;
  showTable?: boolean;
  showHorizontalRule?: boolean;
  showTextAlign?: boolean;
  showTextColor?: boolean;
  showHighlight?: boolean;
  showUndo?: boolean;
  showRedo?: boolean;
  showFullscreen?: boolean;
  customButtons?: ToolbarButton[];
}

export interface ToolbarButton {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: (editor: any) => void;
  isActive?: (editor: any) => boolean;
  isDisabled?: (editor: any) => boolean;
  tooltip?: string;
}

// ============================================================================
// HOOK TYPES
// ============================================================================

export interface UseRichTextEditorOptions {
  initialContent?: string | EditorContent;
  placeholder?: string;
  editable?: boolean;
  autofocus?: boolean;
  maxLength?: number;
  enableAutoSave?: boolean;
  autoSaveInterval?: number;
  onUpdate?: (content: string, json: EditorContent) => void;
  onSave?: (content: string, json: EditorContent) => void;
  onError?: (error: string) => void;
  imageUploadHandler?: (file: File) => Promise<string>;
}

export interface UseRichTextEditorReturn {
  editor: any;
  content: string;
  jsonContent: EditorContent | null;
  wordCount: number;
  characterCount: number;
  isEditable: boolean;
  isEmpty: boolean;
  canUndo: boolean;
  canRedo: boolean;
  setContent: (content: string | EditorContent) => void;
  getHTML: () => string;
  getJSON: () => EditorContent;
  getText: () => string;
  focus: () => void;
  blur: () => void;
  undo: () => void;
  redo: () => void;
  clearContent: () => void;
  setEditable: (editable: boolean) => void;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface RichTextEditorProps {
  value?: string | EditorContent;
  onChange?: (content: string, json: EditorContent) => void;
  placeholder?: string;
  editable?: boolean;
  autofocus?: boolean;
  maxLength?: number;
  className?: string;
  toolbarConfig?: ToolbarConfig;
  editorConfig?: EditorConfig;
  showWordCount?: boolean;
  showCharacterCount?: boolean;
  enableAutoSave?: boolean;
  autoSaveInterval?: number;
  onSave?: (content: string, json: EditorContent) => void;
  onError?: (error: string) => void;
  imageUploadHandler?: (file: File) => Promise<string>;
}

export interface EditorToolbarProps {
  editor: any;
  config?: ToolbarConfig;
  className?: string;
}

export interface EditorMenuBarProps {
  editor: any;
  config?: ToolbarConfig;
  className?: string;
}

export interface EditorBubbleMenuProps {
  editor: any;
  className?: string;
}

export interface EditorFloatingMenuProps {
  editor: any;
  className?: string;
}

export interface EditorStatusBarProps {
  editor: any;
  showWordCount?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
  className?: string;
}

// ============================================================================
// EXTENSION TYPES
// ============================================================================

export interface LinkOptions {
  openOnClick?: boolean;
  linkOnPaste?: boolean;
  autolink?: boolean;
  defaultProtocol?: string;
  protocols?: string[];
  validate?: (url: string) => boolean;
}

export interface ImageOptions {
  inline?: boolean;
  allowBase64?: boolean;
  uploadHandler?: (file: File) => Promise<string>;
}

export interface TableOptions {
  resizable?: boolean;
  handleWidth?: number;
  cellMinWidth?: number;
  allowTableNodeSelection?: boolean;
}

export interface CodeBlockOptions {
  languageClassPrefix?: string;
  exitOnTripleEnter?: boolean;
  exitOnArrowDown?: boolean;
  defaultLanguage?: string;
}

// ============================================================================
// COLLABORATION TYPES
// ============================================================================

export interface CollaborationConfig {
  enabled: boolean;
  documentId: string;
  userId: string;
  userName: string;
  userColor?: string;
  websocketUrl?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onUserJoin?: (user: CollaborationUser) => void;
  onUserLeave?: (user: CollaborationUser) => void;
}

export interface CollaborationUser {
  id: string;
  name: string;
  color: string;
  cursor?: {
    anchor: number;
    head: number;
  };
}

// ============================================================================
// COMMENT TYPES
// ============================================================================

export interface EditorComment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  created_at: Date;
  updated_at: Date;
  resolved: boolean;
  position: {
    from: number;
    to: number;
  };
  replies?: EditorComment[];
}

export interface CommentConfig {
  enabled: boolean;
  onAddComment?: (comment: Omit<EditorComment, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateComment?: (commentId: string, content: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onResolveComment?: (commentId: string) => void;
}

// ============================================================================
// VERSION HISTORY TYPES
// ============================================================================

export interface EditorVersion {
  id: string;
  content: EditorContent;
  created_at: Date;
  author: {
    id: string;
    name: string;
  };
  description?: string;
  is_auto_save: boolean;
}

export interface VersionHistoryConfig {
  enabled: boolean;
  maxVersions?: number;
  autoSaveInterval?: number;
  onSaveVersion?: (version: Omit<EditorVersion, 'id' | 'created_at'>) => void;
  onRestoreVersion?: (versionId: string) => void;
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export interface ExportOptions {
  format: 'html' | 'markdown' | 'json' | 'text' | 'pdf' | 'docx';
  includeStyles?: boolean;
  customCSS?: string;
  filename?: string;
}

export interface ImportOptions {
  format: 'html' | 'markdown' | 'json' | 'text' | 'docx';
  preserveFormatting?: boolean;
  sanitize?: boolean;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface EditorValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  allowedTags?: string[];
  blockedTags?: string[];
  customValidator?: (content: string, json: EditorContent) => string | null;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// PLUGIN TYPES
// ============================================================================

export interface EditorPlugin {
  name: string;
  extension: any;
  config?: Record<string, any>;
  toolbar?: ToolbarButton[];
  menuItems?: MenuItem[];
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action: (editor: any) => void;
  isActive?: (editor: any) => boolean;
  isDisabled?: (editor: any) => boolean;
  shortcut?: string;
  group?: string;
}
