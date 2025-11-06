import React, { useEffect, useState, useMemo } from 'react';
import { LatexRenderer } from '../lib/latex-renderer';
import type { LatexPreviewProps } from '../types';
import '../styles/preview.css';

/**
 * LaTeX Preview component
 * Renders LaTeX content to HTML with math support via KaTeX
 */
export const LatexPreview: React.FC<LatexPreviewProps> = ({
  content,
  height = '600px',
  className = '',
  onError
}) => {
  const [renderedHtml, setRenderedHtml] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  // Create renderer instance
  const renderer = useMemo(() => new LatexRenderer(), []);

  useEffect(() => {
    const renderContent = async () => {
      setIsRendering(true);
      setError(null);

      try {
        // Small delay to avoid blocking UI
        await new Promise(resolve => setTimeout(resolve, 0));

        const html = renderer.render(content);
        setRenderedHtml(html);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        if (onError) {
          onError(error);
        }
      } finally {
        setIsRendering(false);
      }
    };

    renderContent();
  }, [content, renderer, onError]);

  return (
    <div
      className={`latex-preview-container ${className}`}
      style={{ height }}
    >
      {isRendering && (
        <div className="latex-preview-loading">
          Rendering...
        </div>
      )}

      {error && (
        <div className="latex-preview-error">
          <strong>Rendering Error:</strong><br />
          {error.message}
        </div>
      )}

      {!isRendering && !error && (
        <div
          className="latex-preview"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      )}
    </div>
  );
};

export default LatexPreview;
