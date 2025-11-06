/**
 * OverLeaf Clone - Client-side LaTeX Editor
 *
 * A lightweight, client-side LaTeX editor with live preview
 * that can be easily integrated into any React project.
 */

// Components
export { LatexEditor } from './components/LatexEditor';
export { LatexPreview } from './components/LatexPreview';
export { LatexEditorWithPreview } from './components/LatexEditorWithPreview';

// Types
export type {
  LatexEditorProps,
  LatexPreviewProps,
  LatexEditorWithPreviewProps,
  LatexRenderOptions
} from './types';

// Utilities
export { LatexRenderer } from './lib/latex-renderer';
export { useDebounce, useEditorContent } from './lib/hooks';

// Styles - consumers need to import these manually if needed
// import 'overleaf-clone/dist/style.css';
