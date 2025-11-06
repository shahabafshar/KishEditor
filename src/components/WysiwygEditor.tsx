import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Mathematics from '@tiptap/extension-mathematics';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Link } from '@tiptap/extension-link';
import { Highlight } from '@tiptap/extension-highlight';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MathInputDialog } from './MathInputDialog';
import { latexSerializer } from '../lib/latex-serializer';
import type { WysiwygEditorProps } from '../types';
import 'katex/dist/katex.min.css';

/**
 * WYSIWYG Editor using Tiptap
 * Provides visual editing with LaTeX math support
 */
export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  initialContent = '',
  onChange,
  height = '600px',
  className = '',
  readOnly = false,
  onEditorReady,
  onFocusChange
}) => {
  const [mathDialogOpen, setMathDialogOpen] = useState(false);
  const [mathDisplayMode, setMathDisplayMode] = useState(false);
  const [currentMathLatex, setCurrentMathLatex] = useState('');
  const isInitialMount = useRef(true);
  const skipOnChangeRef = useRef(false);
  const lastContentFromEditor = useRef<string>('');

  // Convert initial LaTeX to Tiptap format
  const initialTiptapContent = useMemo(() => {
    return latexSerializer.fromLatex(initialContent || '');
  }, [initialContent]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        paragraph: {
          HTMLAttributes: {
            class: 'editor-paragraph'
          }
        },
        hardBreak: {
          keepMarks: true
        }
      }),
      Underline,
      Highlight.configure({
        multicolor: false
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link'
        }
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table'
        }
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: 'Start typing your document here...'
      }),
      Mathematics.configure({
        katexOptions: {
          strict: false,
          throwOnError: false,
          displayMode: false
        }
      })
    ],
    editable: !readOnly,
    onCreate: ({ editor }) => {
      if (initialContent) {
        skipOnChangeRef.current = true;
        const tiptapContent = latexSerializer.fromLatex(initialContent);
        editor.commands.setContent(tiptapContent);
        lastContentFromEditor.current = initialContent;
        isInitialMount.current = false;
      }
      // Notify parent component that editor is ready
      if (onEditorReady) {
        onEditorReady(editor);
      }
    },
    onFocus: ({ editor }) => {
      // Track focus changes and notify parent
      if (onFocusChange) {
        onFocusChange(true);
      }
    },
    onBlur: ({ editor }) => {
      // Track blur and notify parent
      if (onFocusChange) {
        onFocusChange(false);
      }
    },
    onUpdate: ({ editor }) => {
      // Skip onChange during initial content load
      if (skipOnChangeRef.current) {
        skipOnChangeRef.current = false;
        return;
      }
      
      if (onChange) {
        // Convert Tiptap content back to LaTeX
        const tiptapJSON = editor.getJSON();
        const latex = latexSerializer.toLatex(tiptapJSON as any);
        lastContentFromEditor.current = latex;
        onChange(latex);
      }
    },
    editorProps: {
      attributes: {
        class: 'wysiwyg-editor-content',
        style: `min-height: ${height};`,
        tabindex: '0'
      }
    }
  });

  // Set content when editor becomes available or initialContent changes
  // BUT only if the change came from outside (not from the editor's own onChange)
  useEffect(() => {
    if (!editor) return;
    
    // Use a small timeout to ensure editor is fully initialized
    const timeoutId = setTimeout(() => {
      if (!editor) return;
      
      // Only update if not initial mount (onCreate handles that)
      if (isInitialMount.current) return;
      
      // Don't update if this content came from the editor itself
      // This prevents circular updates when preview reloads
      if (lastContentFromEditor.current === initialContent) {
        return;
      }
      
      // Compare current editor content with incoming initialContent
      const currentTiptapJSON = editor.getJSON();
      const currentLatex = latexSerializer.toLatex(currentTiptapJSON as any);
      
      // Only update if the content is actually different
      if (currentLatex === initialContent) {
        return;
      }
      
      const tiptapContent = latexSerializer.fromLatex(initialContent || '');
      
      try {
        skipOnChangeRef.current = true;
        editor.commands.setContent(tiptapContent);
        lastContentFromEditor.current = initialContent;
      } catch (error) {
        console.error('[WysiwygEditor] Error setting content:', error);
      }
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [initialContent, editor]);

  const handleMathInsert = (displayMode: boolean) => {
    setMathDisplayMode(displayMode);
    setCurrentMathLatex('');
    setMathDialogOpen(true);
  };

  const handleMathConfirm = (latex: string) => {
    if (!editor) return;

    if (mathDisplayMode) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'blockMath',
          attrs: { latex }
        })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'inlineMath',
          attrs: { latex }
        })
        .run();
    }
  };

  // Notify parent when editor becomes available
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  return (
    <div className={`wysiwyg-editor-container ${className}`}>
      <EditorContent editor={editor} />

      <MathInputDialog
        isOpen={mathDialogOpen}
        onClose={() => setMathDialogOpen(false)}
        initialLatex={currentMathLatex}
        displayMode={mathDisplayMode}
        onConfirm={handleMathConfirm}
      />
    </div>
  );
};

export default WysiwygEditor;
