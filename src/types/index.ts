export interface LatexEditorProps {
  /**
   * Initial LaTeX content
   */
  initialContent?: string;

  /**
   * Callback when content changes
   */
  onChange?: (content: string) => void;

  /**
   * Height of the editor
   */
  height?: string;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Read-only mode
   */
  readOnly?: boolean;

  /**
   * Callback to get editor view instance
   */
  onEditorReady?: (view: any) => void;

  /**
   * Callback when editor focus changes
   */
  onFocusChange?: (hasFocus: boolean) => void;
}

export interface LatexPreviewProps {
  /**
   * LaTeX content to render
   */
  content: string;

  /**
   * Height of the preview
   */
  height?: string;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Callback for errors during rendering
   */
  onError?: (error: Error) => void;
}

export interface LatexEditorWithPreviewProps {
  /**
   * Initial LaTeX content
   */
  initialContent?: string;

  /**
   * Callback when content changes
   */
  onChange?: (content: string) => void;

  /**
   * Height of the entire component
   */
  height?: string;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Show/hide preview panel
   */
  showPreview?: boolean;

  /**
   * Callback for preview rendering errors
   */
  onPreviewError?: (error: Error) => void;

  /**
   * Debounce delay for preview updates (ms)
   */
  previewDebounce?: number;
}

export interface LatexRenderOptions {
  /**
   * Whether to use strict mode for parsing
   */
  strict?: boolean;

  /**
   * Custom macro definitions
   */
  macros?: Record<string, string>;

  /**
   * Error handling mode
   */
  throwOnError?: boolean;
}

export interface WysiwygEditorProps {
  /**
   * Initial content (LaTeX or HTML)
   */
  initialContent?: string;

  /**
   * Callback when content changes
   */
  onChange?: (content: string) => void;

  /**
   * Height of the editor
   */
  height?: string;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Read-only mode
   */
  readOnly?: boolean;

  /**
   * Callback for math insertion
   */
  onMathInsert?: (latex: string, isDisplay: boolean) => void;

  /**
   * Callback to get editor instance
   */
  onEditorReady?: (editor: any) => void;

  /**
   * Callback when editor focus changes
   */
  onFocusChange?: (hasFocus: boolean) => void;
}

export interface MathInputDialogProps {
  /**
   * Whether the dialog is open
   */
  isOpen: boolean;

  /**
   * Callback when dialog closes
   */
  onClose: () => void;

  /**
   * Initial LaTeX content
   */
  initialLatex?: string;

  /**
   * Display mode (inline or block)
   */
  displayMode?: boolean;

  /**
   * Callback when math is confirmed
   */
  onConfirm: (latex: string) => void;
}

export type EditorMode = 'source' | 'wysiwyg';

export interface DualModeEditorProps {
  /**
   * Initial LaTeX content
   */
  initialContent?: string;

  /**
   * Callback when content changes
   */
  onChange?: (content: string) => void;

  /**
   * Height of the editor
   */
  height?: string;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Initial editor mode
   */
  initialMode?: EditorMode;

  /**
   * Callback when mode changes
   */
  onModeChange?: (mode: EditorMode) => void;

  /**
   * Show preview panel
   */
  showPreview?: boolean;

  /**
   * Preview debounce delay (ms)
   */
  previewDebounce?: number;
}
