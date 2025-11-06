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
