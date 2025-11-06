import React, { useState } from 'react';
import type { Editor } from '@tiptap/react';
import type { EditorView } from '@codemirror/view';
import { undo, redo } from '@codemirror/commands';

export type EditorInstance = Editor | EditorView | null;

export interface UnifiedToolbarProps {
  editor: EditorInstance;
  mode: 'source' | 'wysiwyg';
  onMathInsert?: (displayMode: boolean) => void;
  hasFocus?: boolean; // Whether the editor currently has focus
}

type RibbonTab = 'home' | 'insert';

/**
 * Unified Toolbar Component with Ribbon Interface
 * Works with both Source (CodeMirror) and WYSIWYG (Tiptap) editors
 * Inserts LaTeX commands in source mode, Tiptap nodes in WYSIWYG mode
 */
export const UnifiedToolbar: React.FC<UnifiedToolbarProps> = React.memo(({
  editor,
  mode,
  onMathInsert,
  hasFocus = false
}) => {
  const [activeTab, setActiveTab] = useState<RibbonTab>('home');

  const ToolbarButton = ({
    onClick,
    active = false,
    disabled = false,
    title,
    children
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`ribbon-button ${active ? 'active' : ''}`}
      title={title}
      type="button"
    >
      {children}
    </button>
  );

  const RibbonGroup = ({
    label,
    colorScheme = 'default',
    children
  }: {
    label: string;
    colorScheme?: 'text' | 'structure' | 'lists' | 'history' | 'elements' | 'math' | 'default';
    children: React.ReactNode;
  }) => (
    <div className={`ribbon-group ribbon-group-${colorScheme}`}>
      <div className="ribbon-group-label">{label}</div>
      <div className="ribbon-group-content">
        {children}
      </div>
    </div>
  );

  // Helper to insert LaTeX command in source mode
  const insertLatexCommand = (command: string, wrapSelection = false) => {
    if (mode !== 'source' || !editor) return;
    const view = editor as EditorView;
    const state = view.state;
    const selection = state.selection.main;
    const selectedText = state.sliceDoc(selection.from, selection.to);

    let insertText: string;
    if (wrapSelection && selectedText) {
      // Wrap selection in command
      insertText = `\\${command}{${selectedText}}`;
    } else {
      // Insert command with placeholder
      insertText = `\\${command}{}`;
    }

    view.dispatch({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: insertText
      },
      selection: {
        anchor: selection.from + insertText.length - 1, // Position cursor before closing brace
        head: selection.from + insertText.length - 1
      }
    });
    view.focus();
  };

  // Helper to insert LaTeX environment in source mode
  const insertLatexEnvironment = (envName: string) => {
    if (mode !== 'source' || !editor) return;
    const view = editor as EditorView;
    const state = view.state;
    const selection = state.selection.main;
    const line = state.doc.lineAt(selection.from);
    const indent = line.text.match(/^\s*/)?.[0] || '';

    const env = `\\begin{${envName}}\n${indent}  \n\\end{${envName}}`;
    
    view.dispatch({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: env
      },
      selection: {
        anchor: selection.from + env.indexOf('\n') + indent.length + 3, // Position cursor in environment
        head: selection.from + env.indexOf('\n') + indent.length + 3
      }
    });
    view.focus();
  };

  // Helper to insert LaTeX math in source mode
  const insertLatexMath = (displayMode: boolean) => {
    if (mode !== 'source' || !editor) return;
    const view = editor as EditorView;
    const state = view.state;
    const selection = state.selection.main;
    const selectedText = state.sliceDoc(selection.from, selection.to);

    let insertText: string;
    if (displayMode) {
      insertText = selectedText ? `$$${selectedText}$$` : '$$$$';
    } else {
      insertText = selectedText ? `$${selectedText}$` : '$$';
    }

    view.dispatch({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: insertText
      },
      selection: {
        anchor: selection.from + insertText.length - (displayMode ? 2 : 1),
        head: selection.from + insertText.length - (displayMode ? 2 : 1)
      }
    });
    view.focus();
  };

  // Helper to insert LaTeX section command
  const insertLatexSection = (level: number) => {
    if (mode !== 'source' || !editor) return;
    const view = editor as EditorView;
    const state = view.state;
    const selection = state.selection.main;
    const line = state.doc.lineAt(selection.from);
    
    const commands = ['section', 'subsection', 'subsubsection'];
    const command = commands[level - 1] || 'section';
    const insertText = `\\${command}{}\n\n`;

    // Insert at start of line
    view.dispatch({
      changes: {
        from: line.from,
        to: selection.to,
        insert: insertText
      },
      selection: {
        anchor: line.from + insertText.length - 2, // Position cursor in braces
        head: line.from + insertText.length - 2
      }
    });
    view.focus();
  };

  // WYSIWYG mode handlers
  const tiptapEditor = mode === 'wysiwyg' ? (editor as Editor) : null;
  // Enable toolbar when editor exists OR when editor has focus
  const isEditorReady = !!editor || hasFocus;

  return (
    <div className="ribbon-toolbar">
      {/* Ribbon Tabs */}
      <div className="ribbon-tabs">
        <button
          className={`ribbon-tab ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
          type="button"
        >
          Home
        </button>
        <button
          className={`ribbon-tab ${activeTab === 'insert' ? 'active' : ''}`}
          onClick={() => setActiveTab('insert')}
          type="button"
        >
          Insert
        </button>
      </div>

      {/* Ribbon Content */}
      <div className="ribbon-content">
        {activeTab === 'home' && (
          <>
            {/* Text Formatting Group */}
            <RibbonGroup label="Text" colorScheme="text">
              <ToolbarButton
                onClick={() => {
                  if (!isEditorReady) return;
                  if (mode === 'wysiwyg' && tiptapEditor) {
                    tiptapEditor.chain().focus().toggleBold().run();
                  } else {
                    insertLatexCommand('textbf', true);
                  }
                }}
                active={mode === 'wysiwyg' && tiptapEditor ? tiptapEditor.isActive('bold') : false}
                disabled={!isEditorReady}
                title="Bold (Ctrl+B)"
              >
                <strong>B</strong>
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  if (!isEditorReady) return;
                  if (mode === 'wysiwyg' && tiptapEditor) {
                    tiptapEditor.chain().focus().toggleItalic().run();
                  } else {
                    insertLatexCommand('textit', true);
                  }
                }}
                active={mode === 'wysiwyg' && tiptapEditor ? tiptapEditor.isActive('italic') : false}
                disabled={!isEditorReady}
                title="Italic (Ctrl+I)"
              >
                <em>I</em>
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  if (!isEditorReady) return;
                  if (mode === 'wysiwyg' && tiptapEditor) {
                    tiptapEditor.chain().focus().toggleUnderline().run();
                  } else {
                    insertLatexCommand('underline', true);
                  }
                }}
                active={mode === 'wysiwyg' && tiptapEditor ? tiptapEditor.isActive('underline') : false}
                disabled={!isEditorReady}
                title="Underline (Ctrl+U)"
              >
                <u>U</u>
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  if (!isEditorReady) return;
                  if (mode === 'wysiwyg' && tiptapEditor) {
                    tiptapEditor.chain().focus().toggleCode().run();
                  } else {
                    insertLatexCommand('texttt', true);
                  }
                }}
                active={mode === 'wysiwyg' && tiptapEditor ? tiptapEditor.isActive('code') : false}
                disabled={!isEditorReady}
                title="Code"
              >
                <code>{'<>'}</code>
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  if (!isEditorReady) return;
                  if (mode === 'wysiwyg' && tiptapEditor) {
                    tiptapEditor.chain().focus().toggleHighlight().run();
                  } else {
                    insertLatexCommand('hl', true);
                  }
                }}
                active={mode === 'wysiwyg' && tiptapEditor ? tiptapEditor.isActive('highlight') : false}
                disabled={!isEditorReady}
                title="Highlight"
              >
                <span style={{ backgroundColor: '#ffff00', padding: '0 4px' }}>H</span>
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  if (!isEditorReady) return;
                  if (mode === 'wysiwyg' && tiptapEditor) {
                    tiptapEditor.chain().focus().toggleStrike().run();
                  } else {
                    insertLatexCommand('sout', true);
                  }
                }}
                active={mode === 'wysiwyg' && tiptapEditor ? tiptapEditor.isActive('strike') : false}
                disabled={!isEditorReady}
                title="Strikethrough"
              >
                <s>S</s>
              </ToolbarButton>
            </RibbonGroup>

            {/* Headings Group */}
            <RibbonGroup label="Headings" colorScheme="structure">
              <ToolbarButton
                onClick={() => {
                  if (!isEditorReady) return;
                  if (mode === 'wysiwyg' && tiptapEditor) {
                    tiptapEditor.chain().focus().toggleHeading({ level: 1 }).run();
                  } else {
                    insertLatexSection(1);
                  }
                }}
                active={mode === 'wysiwyg' && tiptapEditor ? tiptapEditor.isActive('heading', { level: 1 }) : false}
                disabled={!isEditorReady}
                title="Section (H1)"
              >
                H1
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  if (!isEditorReady) return;
                  if (mode === 'wysiwyg' && tiptapEditor) {
                    tiptapEditor.chain().focus().toggleHeading({ level: 2 }).run();
                  } else {
                    insertLatexSection(2);
                  }
                }}
                active={mode === 'wysiwyg' && tiptapEditor ? tiptapEditor.isActive('heading', { level: 2 }) : false}
                disabled={!isEditorReady}
                title="Subsection (H2)"
              >
                H2
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  if (!isEditorReady) return;
                  if (mode === 'wysiwyg' && tiptapEditor) {
                    tiptapEditor.chain().focus().toggleHeading({ level: 3 }).run();
                  } else {
                    insertLatexSection(3);
                  }
                }}
                active={mode === 'wysiwyg' && tiptapEditor ? tiptapEditor.isActive('heading', { level: 3 }) : false}
                disabled={!isEditorReady}
                title="Subsubsection (H3)"
              >
                H3
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  if (!isEditorReady) return;
                  if (mode === 'wysiwyg' && tiptapEditor) {
                    tiptapEditor.chain().focus().setParagraph().run();
                  } else {
                    // In source mode, just insert a new paragraph (empty line)
                    if (editor) {
                      const view = editor as EditorView;
                      const state = view.state;
                      const selection = state.selection.main;
                      view.dispatch({
                        changes: {
                          from: selection.from,
                          to: selection.to,
                          insert: '\n\n'
                        }
                      });
                      view.focus();
                    }
                  }
                }}
                active={mode === 'wysiwyg' && tiptapEditor ? tiptapEditor.isActive('paragraph') : false}
                disabled={!isEditorReady}
                title="Paragraph"
              >
                ¶
              </ToolbarButton>
            </RibbonGroup>

            {/* Lists Group */}
            <RibbonGroup label="Lists" colorScheme="lists">
              <ToolbarButton
                onClick={() => {
                  if (!isEditorReady) return;
                  if (mode === 'wysiwyg' && tiptapEditor) {
                    tiptapEditor.chain().focus().toggleBulletList().run();
                  } else {
                    insertLatexEnvironment('itemize');
                  }
                }}
                active={mode === 'wysiwyg' && tiptapEditor ? tiptapEditor.isActive('bulletList') : false}
                disabled={!isEditorReady}
                title="Bullet List"
              >
                •
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  if (!isEditorReady) return;
                  if (mode === 'wysiwyg' && tiptapEditor) {
                    tiptapEditor.chain().focus().toggleOrderedList().run();
                  } else {
                    insertLatexEnvironment('enumerate');
                  }
                }}
                active={mode === 'wysiwyg' && tiptapEditor ? tiptapEditor.isActive('orderedList') : false}
                disabled={!isEditorReady}
                title="Numbered List"
              >
                1.
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  if (!isEditorReady) return;
                  if (mode === 'wysiwyg' && tiptapEditor) {
                    tiptapEditor.chain().focus().toggleBlockquote().run();
                  } else {
                    insertLatexEnvironment('quote');
                  }
                }}
                active={mode === 'wysiwyg' && tiptapEditor ? tiptapEditor.isActive('blockquote') : false}
                disabled={!isEditorReady}
                title="Blockquote"
              >
                "
              </ToolbarButton>
            </RibbonGroup>

            {/* Undo/Redo Group */}
            <RibbonGroup label="History" colorScheme="history">
              <ToolbarButton
                onClick={() => {
                  if (!isEditorReady) return;
                  if (mode === 'wysiwyg' && tiptapEditor) {
                    tiptapEditor.chain().focus().undo().run();
                  } else if (mode === 'source' && editor) {
                    const view = editor as EditorView;
                    undo(view);
                  }
                }}
                disabled={!isEditorReady || (mode === 'wysiwyg' && tiptapEditor ? !tiptapEditor.can().undo() : false)}
                title="Undo (Ctrl+Z)"
              >
                ↶
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  if (!isEditorReady) return;
                  if (mode === 'wysiwyg' && tiptapEditor) {
                    tiptapEditor.chain().focus().redo().run();
                  } else if (mode === 'source' && editor) {
                    const view = editor as EditorView;
                    redo(view);
                  }
                }}
                disabled={!isEditorReady || (mode === 'wysiwyg' && tiptapEditor ? !tiptapEditor.can().redo() : false)}
                title="Redo (Ctrl+Y)"
              >
                ↷
              </ToolbarButton>
            </RibbonGroup>
          </>
        )}

        {activeTab === 'insert' && (
          <>
            {/* Table & Link Group */}
            <RibbonGroup label="Elements" colorScheme="elements">
              <ToolbarButton
                onClick={async () => {
                  if (!editor) return;
                  
                  if (mode === 'wysiwyg' && tiptapEditor) {
                    // Ensure editor has focus first
                    tiptapEditor.commands.focus();
                    
                    // Wait a bit for focus to be established
                    await new Promise(resolve => setTimeout(resolve, 10));
                    
                    // Check if we can insert a table directly
                    if (tiptapEditor.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true })) {
                      tiptapEditor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                    } else {
                      // If cursor is inside a table, exit the table first
                      const { state } = tiptapEditor;
                      const { selection } = state;
                      const { $from } = selection;
                      
                      // Find the table node
                      let tablePos = -1;
                      let tableNode = null;
                      for (let depth = $from.depth; depth > 0; depth--) {
                        const node = $from.node(depth);
                        if (node.type.name === 'table') {
                          tablePos = $from.before(depth);
                          tableNode = node;
                          break;
                        }
                      }
                      
                      if (tablePos >= 0 && tableNode) {
                        // Move cursor after the table and insert a paragraph
                        const afterTablePos = tablePos + tableNode.nodeSize;
                        tiptapEditor.chain()
                          .setTextSelection(afterTablePos)
                          .insertContent('<p></p>')
                          .focus()
                          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                          .run();
                      } else {
                        // Try to exit table using arrow keys or other method
                        // Move to end of document and insert
                        const docSize = state.doc.content.size;
                        tiptapEditor.chain()
                          .setTextSelection(docSize)
                          .insertContent('<p></p>')
                          .focus()
                          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                          .run();
                      }
                    }
                  } else {
                    // Insert LaTeX table
                    if (editor) {
                      const view = editor as EditorView;
                      const state = view.state;
                      const selection = state.selection.main;
                      const line = state.doc.lineAt(selection.from);
                      const indent = line.text.match(/^\s*/)?.[0] || '';
                      
                      // Create a properly formatted table with header row
                      const table = `\\begin{table}[h]\n${indent}  \\centering\n${indent}  \\begin{tabular}{|l|c|r|}\n${indent}    \\hline\n${indent}    Header 1 & Header 2 & Header 3 \\\\\n${indent}    \\hline\n${indent}    Cell 1 & Cell 2 & Cell 3 \\\\\n${indent}    \\hline\n${indent}    Cell 4 & Cell 5 & Cell 6 \\\\\n${indent}    \\hline\n${indent}  \\end{tabular}\n${indent}  \\caption{Table caption}\n${indent}\\end{table}\n\n`;
                      
                      view.dispatch({
                        changes: {
                          from: selection.from,
                          to: selection.to,
                          insert: table
                        },
                        selection: {
                          anchor: selection.from + table.length,
                          head: selection.from + table.length
                        }
                      });
                      view.focus();
                    }
                  }
                }}
                disabled={!editor}
                title="Insert Table"
              >
                ⊞
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  if (!isEditorReady) return;
                  if (mode === 'wysiwyg' && tiptapEditor) {
                    const url = window.prompt('Enter URL:');
                    if (url) {
                      tiptapEditor.chain().focus().setLink({ href: url }).run();
                    }
                  } else {
                    const url = window.prompt('Enter URL:');
                    const text = window.prompt('Enter link text:', '');
                    if (url && text) {
                      insertLatexCommand(`href{${url}}{${text}}`, false);
                    }
                  }
                }}
                active={mode === 'wysiwyg' && tiptapEditor ? tiptapEditor.isActive('link') : false}
                disabled={!isEditorReady}
                title="Insert Link"
              >
                🔗
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  if (mode === 'wysiwyg' && tiptapEditor) {
                    tiptapEditor.chain().focus().unsetLink().run();
                  }
                  // In source mode, link removal would require parsing - skip for now
                }}
                disabled={mode === 'source' || (mode === 'wysiwyg' && tiptapEditor && !tiptapEditor.isActive('link'))}
                title="Remove Link"
              >
                🔓
              </ToolbarButton>
            </RibbonGroup>

            {/* Math Group */}
            <RibbonGroup label="Math" colorScheme="math">
              <ToolbarButton
                onClick={() => {
                  if (!isEditorReady && mode === 'source') return;
                  if (mode === 'wysiwyg' && onMathInsert) {
                    onMathInsert(false);
                  } else {
                    insertLatexMath(false);
                  }
                }}
                disabled={mode === 'source' && !isEditorReady}
                title="Insert Inline Math"
              >
                $x$
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  if (!isEditorReady && mode === 'source') return;
                  if (mode === 'wysiwyg' && onMathInsert) {
                    onMathInsert(true);
                  } else {
                    insertLatexMath(true);
                  }
                }}
                disabled={mode === 'source' && !isEditorReady}
                title="Insert Display Math"
              >
                $$∫$$
              </ToolbarButton>
            </RibbonGroup>
          </>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if editor instance, mode, onMathInsert, or focus state actually changed
  return (
    prevProps.editor === nextProps.editor &&
    prevProps.mode === nextProps.mode &&
    prevProps.onMathInsert === nextProps.onMathInsert &&
    prevProps.hasFocus === nextProps.hasFocus
  );
});

export default UnifiedToolbar;
