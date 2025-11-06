/**
 * KishEditor - Client-side LaTeX Editor
 *
 * A lightweight, client-side LaTeX editor with live preview and WYSIWYG mode
 * that can be easily integrated into any React project.
 */

// Classic Components
export { LatexEditor } from './components/LatexEditor';
export { LatexPreview } from './components/LatexPreview';
export { LatexEditorWithPreview } from './components/LatexEditorWithPreview';

// WYSIWYG Components
export { WysiwygEditor } from './components/WysiwygEditor';
export { DualModeEditor } from './components/DualModeEditor';
export { MathInputDialog } from './components/MathInputDialog';
export { WysiwygToolbar } from './components/toolbar/WysiwygToolbar';

// Types
export type {
  LatexEditorProps,
  LatexPreviewProps,
  LatexEditorWithPreviewProps,
  LatexRenderOptions,
  WysiwygEditorProps,
  MathInputDialogProps,
  DualModeEditorProps,
  EditorMode
} from './types';

// Utilities
export { LatexRenderer } from './lib/latex-renderer';
export { LatexSerializer, latexSerializer } from './lib/latex-serializer';
export { useDebounce, useEditorContent } from './lib/hooks';

// Styles - consumers need to import these manually if needed
// import 'kish-editor/dist/style.css';
