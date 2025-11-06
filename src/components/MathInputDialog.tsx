import { useEffect, useRef, useState } from 'react';
import type { MathInputDialogProps } from '../types';
import 'mathlive/static.css';

/**
 * Math Input Dialog using MathLive
 * Provides a visual interface for editing LaTeX math expressions
 */
export const MathInputDialog: React.FC<MathInputDialogProps> = ({
  isOpen,
  onClose,
  initialLatex = '',
  displayMode = false,
  onConfirm
}) => {
  const mathFieldRef = useRef<any>(null);
  const [latex, setLatex] = useState(initialLatex);

  useEffect(() => {
    if (isOpen && !mathFieldRef.current) {
      // Dynamically import MathLive to avoid SSR issues
      import('mathlive').then(() => {
        if (mathFieldRef.current) {
          const mathfield = mathFieldRef.current as any;
          mathfield.value = initialLatex;

          // Configure mathfield
          mathfield.setOptions({
            virtualKeyboardMode: 'manual',
            smartFence: true,
            smartMode: true
          });

          // Listen for input changes
          mathfield.addEventListener('input', (evt: Event) => {
            const target = evt.target as any;
            setLatex(target.value);
          });

          // Focus the mathfield
          setTimeout(() => mathfield.focus(), 100);
        }
      });
    }
  }, [isOpen, initialLatex]);

  useEffect(() => {
    if (mathFieldRef.current && isOpen) {
      mathFieldRef.current.value = initialLatex;
      setLatex(initialLatex);
    }
  }, [initialLatex, isOpen]);

  const handleConfirm = () => {
    onConfirm(latex);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="math-dialog-overlay" onClick={onClose}>
      <div className="math-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="math-dialog-header">
          <h3>{displayMode ? 'Display Math' : 'Inline Math'}</h3>
          <button
            className="math-dialog-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="math-dialog-body">
          <label className="math-dialog-label">
            Enter LaTeX expression:
          </label>

          <math-field
            ref={mathFieldRef}
            onKeyDown={handleKeyDown}
            className="math-input-field"
          >
            {initialLatex}
          </math-field>

          <div className="math-dialog-preview">
            <label className="math-dialog-label">Preview:</label>
            <div className="math-preview-content">
              {latex ? (
                <math-field read-only>{latex}</math-field>
              ) : (
                <span className="math-preview-placeholder">
                  Enter a math expression above
                </span>
              )}
            </div>
          </div>

          <div className="math-dialog-hint">
            <strong>Tips:</strong> Use keyboard shortcuts like / for fractions,
            _ for subscripts, ^ for superscripts. Press Enter to insert.
          </div>
        </div>

        <div className="math-dialog-footer">
          <button
            className="math-dialog-button secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="math-dialog-button primary"
            onClick={handleConfirm}
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
};

export default MathInputDialog;
