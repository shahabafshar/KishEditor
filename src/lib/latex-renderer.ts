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

    // Process environments
    content = this.processEnvironments(content);

    // Process math (inline and display)
    content = this.processMath(content);

    // Process basic formatting
    content = this.processFormatting(content);

    // Process paragraphs
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
        // Don't wrap if already in a block element
        if (p.match(/^<(h[1-6]|ul|ol|pre|div)/)) {
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
