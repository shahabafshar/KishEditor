import React, { useEffect, useRef, useMemo } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { latex } from '../lib/latex-lang';
import type { LatexEditorProps } from '../types';
import '../styles/editor.css';

/**
 * LaTeX Editor component using CodeMirror 6
 * Provides syntax highlighting and basic editing features for LaTeX
 */
const LatexEditorComponent: React.FC<LatexEditorProps> = ({
  initialContent = '',
  onChange,
  height = '600px',
  className = '',
  readOnly = false,
  onEditorReady,
  onFocusChange
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const isInitialMount = useRef(true);
  const skipOnChangeRef = useRef(false);
  const lastContentFromEditor = useRef<string>('');
  const lastInitialContentRef = useRef<string>(''); // Track last initialContent to prevent unnecessary effects

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
          // Skip onChange during initial content load or programmatic updates
          if (skipOnChangeRef.current) {
            skipOnChangeRef.current = false;
            return;
          }
          
          if (update.docChanged && onChange) {
            const newContent = update.state.doc.toString();
            lastContentFromEditor.current = newContent; // Track what editor emitted
            onChange(newContent);
          }
        }),
        EditorView.focusChangeEffect.of((focused) => {
          // Track focus changes and notify parent
          if (onFocusChange) {
            onFocusChange(focused);
          }
          return null;
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
    lastContentFromEditor.current = initialContent;
    
    // Notify parent component that editor is ready
    if (onEditorReady) {
      onEditorReady(view);
    }
    
    // Mark initial mount as complete after a short delay
    setTimeout(() => {
      isInitialMount.current = false;
    }, 0);

    // Cleanup
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [height, readOnly, onEditorReady]); // Note: onChange and initialContent are intentionally excluded

  // Update content if initialContent changes externally
  // BUT only if the change came from outside (not from the editor's own onChange)
  useEffect(() => {
    if (!viewRef.current) return;
    
    // Only update if not initial mount (initial mount is handled in the creation effect)
    if (isInitialMount.current) {
      lastInitialContentRef.current = initialContent;
      return;
    }
    
    // CRITICAL: Check synchronously BEFORE any async operations
    // Don't update if this content came from the editor itself
    // This prevents circular updates when preview reloads
    if (lastContentFromEditor.current === initialContent) {
      lastInitialContentRef.current = initialContent;
      return; // Exit early - no update needed, no focus loss
    }
    
    // Also check if initialContent hasn't actually changed from last time
    if (lastInitialContentRef.current === initialContent) {
      return; // Exit early - prop hasn't changed, prevent any effect execution
    }
    
    // Compare current editor content with incoming initialContent
    const currentContent = viewRef.current.state.doc.toString();
    
    // Only update if the content is actually different
    if (currentContent === initialContent) {
      // Update the refs to match so we don't check again
      lastContentFromEditor.current = initialContent;
      lastInitialContentRef.current = initialContent;
      return; // Exit early - content already matches
    }
    
    // Update tracking ref BEFORE async operation
    lastInitialContentRef.current = initialContent;
    
    // CRITICAL: Don't use requestAnimationFrame - update synchronously to preserve focus
    // The async delay was causing focus loss
    if (!viewRef.current) return;
    
    // Double-check conditions (they might have changed)
    if (lastContentFromEditor.current === initialContent) {
      return;
    }
    
    const currentContentCheck = viewRef.current.state.doc.toString();
    if (currentContentCheck === initialContent) {
      lastContentFromEditor.current = initialContent;
      return;
    }
    
    // Preserve selection and focus BEFORE dispatch
    const selection = viewRef.current.state.selection.main;
    const hadFocus = viewRef.current.hasFocus;
    const selectionAnchor = selection.anchor;
    const selectionHead = selection.head;
    
    // Mark that we're updating to prevent onChange from firing
    skipOnChangeRef.current = true;
    
    // Update synchronously to preserve focus
    viewRef.current.dispatch({
      changes: {
        from: 0,
        to: currentContentCheck.length,
        insert: initialContent
      },
      selection: {
        anchor: Math.min(selectionAnchor, initialContent.length),
        head: Math.min(selectionHead, initialContent.length)
      },
      // Preserve scroll position and don't scroll into view
      scrollIntoView: false,
      // Don't use userEvent - let CodeMirror handle focus naturally
    });
    
    lastContentFromEditor.current = initialContent;
    
    // Restore focus immediately if it was focused before
    if (hadFocus && viewRef.current && !viewRef.current.hasFocus) {
      // Use microtask to restore focus after React's render cycle
      Promise.resolve().then(() => {
        if (viewRef.current && !viewRef.current.hasFocus) {
          viewRef.current.focus();
        }
      });
    }
  }, [initialContent]);

  return (
    <div className={`latex-editor-container ${className}`}>
      <div ref={editorRef} className="latex-editor" />
    </div>
  );
};

// Export without memo - the useEffect handles preventing unnecessary updates
// Memoizing here would prevent the useEffect from running when we need it to
export const LatexEditor = LatexEditorComponent;

export default LatexEditor;
