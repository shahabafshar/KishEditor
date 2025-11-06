import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { LatexEditor } from './LatexEditor';
import { WysiwygEditor } from './WysiwygEditor';
import { LatexPreview } from './LatexPreview';
import { UnifiedToolbar } from './toolbar/UnifiedToolbar';
import { MathInputDialog } from './MathInputDialog';
import { useDebounce } from '../lib/hooks';
import type { DualModeEditorProps, EditorMode } from '../types';
import type { EditorInstance } from './toolbar/UnifiedToolbar';
import type { EditorView } from '@codemirror/view';
import type { Editor } from '@tiptap/react';

/**
 * Dual Mode Editor
 * Allows switching between Source (CodeMirror) and WYSIWYG (Tiptap) modes
 */
export const DualModeEditor: React.FC<DualModeEditorProps> = ({
  initialContent = '',
  onChange,
  height = '600px',
  className = '',
  initialMode = 'source',
  onModeChange,
  showPreview = true,
  previewDebounce
}) => {
  const [mode, setMode] = useState<EditorMode>(initialMode);
  const [content, setContent] = useState(initialContent);
  const sourceEditorRef = useRef<EditorView | null>(null);
  const wysiwygEditorRef = useRef<Editor | null>(null);
  const [mathDialogOpen, setMathDialogOpen] = useState(false);
  const [mathDisplayMode, setMathDisplayMode] = useState(false);
  const [currentMathLatex, setCurrentMathLatex] = useState('');
  // Track last content emitted by source editor to prevent unnecessary re-renders
  const lastSourceContentRef = useRef<string>(initialContent);
  // Track focus state of editors
  const [sourceEditorHasFocus, setSourceEditorHasFocus] = useState(false);
  const [wysiwygEditorHasFocus, setWysiwygEditorHasFocus] = useState(false);
  // Track editor header height to match preview header
  const editorHeaderRef = useRef<HTMLDivElement>(null);
  const previewHeaderRef = useRef<HTMLDivElement>(null);

  const handleMathConfirm = useCallback((latex: string) => {
    if (mode === 'wysiwyg' && wysiwygEditorRef.current) {
      const editor = wysiwygEditorRef.current as Editor;
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
    }
    setMathDialogOpen(false);
  }, [mode, mathDisplayMode]);
  
  // Debounce content for preview to avoid interfering with editor typing
  // This makes preview updates independent from editor updates
  const previewDebounceDelay = previewDebounce || 300;
  const debouncedContentForPreview = useDebounce(content, previewDebounceDelay);

  // Get current editor instance based on mode
  // Note: This is recomputed on every render, but UnifiedToolbar is memoized to prevent unnecessary re-renders
  const currentEditor: EditorInstance = mode === 'source' ? sourceEditorRef.current : wysiwygEditorRef.current;
  // Get current focus state based on mode
  const currentEditorHasFocus = mode === 'source' ? sourceEditorHasFocus : wysiwygEditorHasFocus;

  const handleModeChange = useCallback((newMode: EditorMode) => {
    setMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
  }, [onModeChange]);

  const handleContentChange = useCallback((newContent: string) => {
    // Track content emitted by source editor BEFORE updating state
    if (mode === 'source') {
      lastSourceContentRef.current = newContent;
    }
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  }, [onChange, mode]);
  
  // CRITICAL: Only pass content to source editor if it's different from what it just emitted
  // This prevents React from re-rendering LatexEditor when content changes from user typing
  // which causes focus loss
  const sourceEditorContent = useMemo(() => {
    if (mode !== 'source') {
      return content; // Not source mode, use content as-is
    }
    
    // If content matches what editor just emitted, return the ref value
    // This keeps the prop reference stable and prevents re-render
    if (lastSourceContentRef.current === content) {
      return lastSourceContentRef.current;
    }
    
    // Content is different (external change), update ref and return new content
    lastSourceContentRef.current = content;
    return content;
  }, [content, mode]);

  const handleMathInsert = useCallback((displayMode: boolean) => {
    if (mode === 'wysiwyg') {
      // Trigger math dialog in WYSIWYG mode
      setMathDisplayMode(displayMode);
      setCurrentMathLatex('');
      setMathDialogOpen(true);
    }
    // For source mode, math insertion is handled directly in UnifiedToolbar
  }, [mode]);

  const handleSourceEditorReady = useCallback((view: EditorView) => {
    sourceEditorRef.current = view;
  }, []);

  const handleWysiwygEditorReady = useCallback((editor: Editor) => {
    wysiwygEditorRef.current = editor;
  }, []);

  // Measure editor header height and apply to preview header
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (editorHeaderRef.current) {
        const height = editorHeaderRef.current.offsetHeight;
        if (previewHeaderRef.current) {
          previewHeaderRef.current.style.height = `${height}px`;
          previewHeaderRef.current.style.minHeight = `${height}px`;
          previewHeaderRef.current.style.maxHeight = `${height}px`;
        }
      }
    };

    // Initial measurement - use setTimeout to ensure DOM is ready
    const timeoutId = setTimeout(updateHeaderHeight, 0);

    // Update on window resize
    window.addEventListener('resize', updateHeaderHeight);
    
    // Use ResizeObserver for more accurate tracking
    let resizeObserver: ResizeObserver | null = null;
    if (editorHeaderRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(updateHeaderHeight);
      resizeObserver.observe(editorHeaderRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateHeaderHeight);
      if (resizeObserver && editorHeaderRef.current) {
        resizeObserver.unobserve(editorHeaderRef.current);
      }
    };
  }, [mode, showPreview]); // Re-measure when mode changes or preview visibility changes

  return (
    <div className={`dual-mode-editor ${className}`} style={{ height }}>
      {/* Unified Toolbar */}
      <UnifiedToolbar
        editor={currentEditor}
        mode={mode}
        onMathInsert={handleMathInsert}
        hasFocus={currentEditorHasFocus}
      />

      {/* Editor Content */}
      <div className="dual-mode-content">
        {showPreview ? (
          <div className="dual-mode-split-view">
            {/* Editor Pane */}
            <div className="dual-mode-pane editor-pane">
              <div className="dual-mode-pane-header" ref={editorHeaderRef}>
                <div className="mode-toggle-switch">
                  <button
                    className={`toggle-option ${mode === 'source' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleModeChange('source');
                    }}
                    type="button"
                  >
                    Source
                  </button>
                  <button
                    className={`toggle-option ${mode === 'wysiwyg' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleModeChange('wysiwyg');
                    }}
                    type="button"
                  >
                    WYSIWYG
                  </button>
                </div>
              </div>
              <div className="dual-mode-pane-content">
                {mode === 'source' ? (
                  <LatexEditor
                    key="source-editor"
                    initialContent={sourceEditorContent}
                    onChange={handleContentChange}
                    height="100%"
                    onEditorReady={handleSourceEditorReady}
                    onFocusChange={setSourceEditorHasFocus}
                  />
                ) : (
                  <WysiwygEditor
                    key="wysiwyg-editor"
                    initialContent={content}
                    onChange={handleContentChange}
                    height="100%"
                    onEditorReady={handleWysiwygEditorReady}
                    onFocusChange={setWysiwygEditorHasFocus}
                  />
                )}
              </div>
            </div>

            {/* Preview Pane */}
            <div className="dual-mode-pane preview-pane">
              <div className="dual-mode-pane-header" ref={previewHeaderRef}>
                Preview
              </div>
              <div className="dual-mode-pane-content">
                <LatexPreview
                  content={debouncedContentForPreview}
                  height="100%"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="dual-mode-full-view">
            <div className="dual-mode-pane editor-pane">
              <div className="dual-mode-pane-header">
                <span>{mode === 'source' ? 'Source Editor' : 'WYSIWYG Editor'}</span>
                <div className="mode-toggle-switch">
                  <button
                    className={`toggle-option ${mode === 'source' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleModeChange('source');
                    }}
                    type="button"
                  >
                    Source
                  </button>
                  <button
                    className={`toggle-option ${mode === 'wysiwyg' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleModeChange('wysiwyg');
                    }}
                    type="button"
                  >
                    WYSIWYG
                  </button>
                </div>
              </div>
              <div className="dual-mode-pane-content">
                {mode === 'source' ? (
                  <LatexEditor
                    key="source-editor-full"
                    initialContent={sourceEditorContent}
                    onChange={handleContentChange}
                    height="100%"
                    onEditorReady={handleSourceEditorReady}
                    onFocusChange={setSourceEditorHasFocus}
                  />
                ) : (
                  <WysiwygEditor
                    key="wysiwyg-editor-full"
                    initialContent={content}
                    onChange={handleContentChange}
                    height="100%"
                    onEditorReady={handleWysiwygEditorReady}
                    onFocusChange={setWysiwygEditorHasFocus}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Math Input Dialog */}
      {mode === 'wysiwyg' && (
        <MathInputDialog
          isOpen={mathDialogOpen}
          onClose={() => setMathDialogOpen(false)}
          initialLatex={currentMathLatex}
          displayMode={mathDisplayMode}
          onConfirm={handleMathConfirm}
        />
      )}
    </div>
  );
};

export default DualModeEditor;
