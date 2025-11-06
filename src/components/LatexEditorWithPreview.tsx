import React from 'react';
import { LatexEditor } from './LatexEditor';
import { LatexPreview } from './LatexPreview';
import { useEditorContent, useDebounce } from '../lib/hooks';
import type { LatexEditorWithPreviewProps } from '../types';
import '../styles/split-view.css';

/**
 * Combined LaTeX Editor with live Preview
 * Provides a split-pane view with editor on the left and preview on the right
 */
export const LatexEditorWithPreview: React.FC<LatexEditorWithPreviewProps> = ({
  initialContent = '',
  onChange,
  height = '600px',
  className = '',
  showPreview = true,
  onPreviewError,
  previewDebounce = 500
}) => {
  const [content, setContent] = useEditorContent(initialContent, onChange);

  // Debounce content for preview to avoid excessive re-renders
  const debouncedContent = useDebounce(content, previewDebounce);

  return (
    <div className={`latex-split-view ${className}`} style={{ height }}>
      {/* Editor Pane */}
      <div className="latex-split-pane">
        <div className="latex-split-pane-header">
          Editor
        </div>
        <div className="latex-split-pane-content">
          <LatexEditor
            initialContent={content}
            onChange={setContent}
            height="100%"
          />
        </div>
      </div>

      {/* Preview Pane */}
      {showPreview && (
        <div className="latex-split-pane">
          <div className="latex-split-pane-header">
            Preview
          </div>
          <div className="latex-split-pane-content">
            <LatexPreview
              content={debouncedContent}
              height="100%"
              onError={onPreviewError}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LatexEditorWithPreview;
