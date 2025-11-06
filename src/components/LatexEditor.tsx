import React, { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { latex } from '../lib/latex-lang';
import type { LatexEditorProps } from '../types';
import '../styles/editor.css';

/**
 * LaTeX Editor component using CodeMirror 6
 * Provides syntax highlighting and basic editing features for LaTeX
 */
export const LatexEditor: React.FC<LatexEditorProps> = ({
  initialContent = '',
  onChange,
  height = '600px',
  className = '',
  readOnly = false
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Create editor state
    const state = EditorState.create({
      doc: initialContent,
      extensions: [
        basicSetup,
        latex(),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorState.readOnly.of(readOnly),
        EditorView.theme({
          '&': {
            height: height,
            fontSize: '14px'
          },
          '.cm-scroller': {
            fontFamily: 'Consolas, Monaco, "Courier New", monospace'
          }
        })
      ]
    });

    // Create editor view
    const view = new EditorView({
      state,
      parent: editorRef.current
    });

    viewRef.current = view;

    // Cleanup
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [height, readOnly]); // Note: onChange and initialContent are intentionally excluded

  // Update content if initialContent changes externally
  useEffect(() => {
    if (viewRef.current) {
      const currentContent = viewRef.current.state.doc.toString();
      if (currentContent !== initialContent) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentContent.length,
            insert: initialContent
          }
        });
      }
    }
  }, [initialContent]);

  return (
    <div className={`latex-editor-container ${className}`}>
      <div ref={editorRef} className="latex-editor" />
    </div>
  );
};

export default LatexEditor;
