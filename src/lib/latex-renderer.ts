import katex from 'katex';
import 'katex/dist/katex.min.css';
import type { LatexRenderOptions } from '../types';

/**
 * Renders LaTeX content to HTML
 * Uses KaTeX for math rendering and custom processing for document structure
 */

export class LatexRenderer {
  private options: LatexRenderOptions;

  constructor(options: LatexRenderOptions = {}) {
    this.options = {
      strict: false,
      throwOnError: false,
      macros: {},
      ...options
    };
  }

  /**
   * Render LaTeX content to HTML string
   */
  render(latexContent: string): string {
    try {
      // Process the LaTeX content
      let html = this.processDocument(latexContent);
      return html;
    } catch (error) {
      if (this.options.throwOnError) {
        throw error;
      }
      return this.renderError(error as Error);
    }
  }

  /**
   * Process the full LaTeX document
   */
  private processDocument(content: string): string {
    // Remove comments
    content = content.replace(/%.*/g, '');

    // Extract document content (between \begin{document} and \end{document})
    const docMatch = content.match(/\\begin\{document\}([\s\S]*)\\end\{document\}/);
    if (docMatch) {
      content = docMatch[1];
    }

    // Process sections
    content = this.processSections(content);

    // Process environments (including tables - must be before formatting)
    content = this.processEnvironments(content);

    // Process math (inline and display)
    content = this.processMath(content);

    // Process basic formatting
    content = this.processFormatting(content);

    // Process paragraphs (must be last to avoid wrapping tables)
    content = this.processParagraphs(content);

    return `<div class="latex-document">${content}</div>`;
  }

  /**
   * Process section commands
   */
  private processSections(content: string): string {
    const sections = [
      { cmd: 'section', tag: 'h1' },
      { cmd: 'subsection', tag: 'h2' },
      { cmd: 'subsubsection', tag: 'h3' }
    ];

    sections.forEach(({ cmd, tag }) => {
      const regex = new RegExp(`\\\\${cmd}\\{([^}]+)\\}`, 'g');
      content = content.replace(regex, `<${tag}>$1</${tag}>`);
    });

    return content;
  }

  /**
   * Process LaTeX environments
   */
  private processEnvironments(content: string): string {
    // Itemize (unordered list)
    content = content.replace(
      /\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g,
      (_, items) => {
        const processedItems = items.replace(/\\item\s+([^\n]*)/g, '<li>$1</li>');
        return `<ul>${processedItems}</ul>`;
      }
    );

    // Enumerate (ordered list)
    content = content.replace(
      /\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g,
      (_, items) => {
        const processedItems = items.replace(/\\item\s+([^\n]*)/g, '<li>$1</li>');
        return `<ol>${processedItems}</ol>`;
      }
    );

    // Verbatim
    content = content.replace(
      /\\begin\{verbatim\}([\s\S]*?)\\end\{verbatim\}/g,
      '<pre><code>$1</code></pre>'
    );

    // Center
    content = content.replace(
      /\\begin\{center\}([\s\S]*?)\\end\{center\}/g,
      '<div style="text-align: center;">$1</div>'
    );

    // Table environment - process tables
    content = this.processTables(content);

    return content;
  }

  /**
   * Process LaTeX table environments
   */
  private processTables(content: string): string {
    // Match table environment: \begin{table}...\begin{tabular}...\end{tabular}...\end{table}
    content = content.replace(
      /\\begin\{table\}(\[.*?\])?([\s\S]*?)\\end\{table\}/g,
      (match, position, tableContent) => {
        // Extract caption if present
        const captionMatch = tableContent.match(/\\caption\{([^}]+)\}/);
        const caption = captionMatch ? captionMatch[1] : null;
        
        // Extract tabular environment
        const tabularMatch = tableContent.match(/\\begin\{tabular\}\{([^}]+)\}([\s\S]*?)\\end\{tabular\}/);
        if (!tabularMatch) {
          return match; // Return original if no tabular found
        }

        const columnSpec = tabularMatch[1];
        const tableBody = tabularMatch[2];

        // Parse column alignment from spec (|c|c|c| -> ['c', 'c', 'c'])
        // Handle cases like |l|c|r| or lcr
        const columns: string[] = [];
        let currentCol = '';
        for (let i = 0; i < columnSpec.length; i++) {
          const char = columnSpec[i];
          if (char === '|') {
            if (currentCol) {
              columns.push(currentCol);
              currentCol = '';
            }
          } else if (['l', 'c', 'r', 'p', 'm', 'b'].includes(char)) {
            currentCol += char;
          }
        }
        if (currentCol) {
          columns.push(currentCol);
        }
        
        // If no columns found, default to center-aligned columns based on | count
        if (columns.length === 0) {
          const pipeCount = (columnSpec.match(/\|/g) || []).length;
          const colCount = Math.max(1, pipeCount - 1);
          columns.push(...Array(colCount).fill('c'));
        }

        // Process rows - split by \\ and handle \hline
        const rows: string[][] = [];
        // Split by lines first, then identify rows by \\ at end of line
        const lines = tableBody.split('\n');
        let currentRowCells: string[] = [];
        
        for (let i = 0; i < lines.length; i++) {
          let line = lines[i].trim();
          
          // Skip empty lines and standalone \hline
          if (!line || line === '\\hline') {
            if (currentRowCells.length > 0) {
              rows.push(currentRowCells);
              currentRowCells = [];
            }
            continue;
          }
          
          // Remove \hline from start/end
          line = line.replace(/^\\hline\s*/, '').replace(/\s*\\hline$/, '');
          
          // Check if line ends with \\ (row terminator)
          const isRowEnd = line.endsWith('\\\\') || line.endsWith('\\');
          if (isRowEnd) {
            line = line.replace(/\\\\?$/, '').trim();
          }
          
          // Split by & to get cells
          const cells = line.split('&').map(cell => cell.trim());
          if (cells.length > 0 && cells.some(c => c !== '')) {
            currentRowCells.push(...cells);
          }
          
          // If this was a row end or we have enough cells, finalize the row
          if (isRowEnd && currentRowCells.length > 0) {
            rows.push(currentRowCells);
            currentRowCells = [];
          }
        }
        
        // Add any remaining cells as a final row
        if (currentRowCells.length > 0) {
          rows.push(currentRowCells);
        }

        // Build HTML table
        let html = '<div class="latex-table-wrapper">';
        html += '<table class="latex-table">';
        
        // Process each row
        rows.forEach((cells, rowIndex) => {
          if (cells.length === 0 || cells.every(c => c === '')) return;

          html += '<tr>';
          cells.forEach((cell, cellIndex) => {
            const align = columns[cellIndex] || columns[columns.length - 1] || 'c';
            let alignment = 'center';
            if (align.includes('l')) alignment = 'left';
            else if (align.includes('r')) alignment = 'right';

            // First row is header if it's the first row
            const tag = rowIndex === 0 ? 'th' : 'td';
            // Process cell content for formatting
            let cellContent = cell || '&nbsp;';
            // Process formatting commands in cell
            cellContent = this.processFormatting(cellContent);
            html += `<${tag} style="text-align: ${alignment};">${cellContent}</${tag}>`;
          });
          html += '</tr>';
        });

        html += '</table>';
        if (caption) {
          html += `<div class="latex-table-caption">${this.escapeHtml(caption)}</div>`;
        }
        html += '</div>';

        return html;
      }
    );

    return content;
  }

  /**
   * Process math expressions
   */
  private processMath(content: string): string {
    // Display math: $$ ... $$ or \[ ... \]
    content = content.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
      return this.renderMath(math, true);
    });

    content = content.replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => {
      return this.renderMath(math, true);
    });

    // Inline math: $ ... $ or \( ... \)
    content = content.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
      return this.renderMath(math, false);
    });

    content = content.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => {
      return this.renderMath(math, false);
    });

    return content;
  }

  /**
   * Render a single math expression using KaTeX
   */
  private renderMath(math: string, displayMode: boolean): string {
    try {
      return katex.renderToString(math.trim(), {
        displayMode,
        throwOnError: false,
        strict: this.options.strict ? 'error' : 'ignore',
        macros: this.options.macros
      });
    } catch (error) {
      return `<span class="katex-error" style="color: red;">${this.escapeHtml(math)}</span>`;
    }
  }

  /**
   * Process basic text formatting
   */
  private processFormatting(content: string): string {
    // Bold: \textbf{...}
    content = content.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');

    // Italic: \textit{...} or \emph{...}
    content = content.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
    content = content.replace(/\\emph\{([^}]+)\}/g, '<em>$1</em>');

    // Underline: \underline{...}
    content = content.replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>');

    // Typewriter: \texttt{...}
    content = content.replace(/\\texttt\{([^}]+)\}/g, '<code>$1</code>');

    // Line breaks
    content = content.replace(/\\\\/g, '<br>');

    return content;
  }

  /**
   * Process paragraphs
   */
  private processParagraphs(content: string): string {
    // Split by double newlines for paragraphs
    const paragraphs = content.split(/\n\s*\n/);
    return paragraphs
      .map(p => {
        p = p.trim();
        if (!p) return '';
        // Don't wrap if already in a block element (including tables)
        if (p.match(/^<(h[1-6]|ul|ol|pre|div|table)/)) {
          return p;
        }
        return `<p>${p}</p>`;
      })
      .join('\n');
  }

  /**
   * Render error message
   */
  private renderError(error: Error): string {
    return `
      <div class="latex-preview-error">
        <strong>LaTeX Rendering Error:</strong><br>
        ${this.escapeHtml(error.message)}
      </div>
    `;
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Default instance
export const defaultRenderer = new LatexRenderer();
