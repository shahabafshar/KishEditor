/**
 * LaTeX Serializer
 * Handles conversion between LaTeX source and Tiptap JSON
 */

export interface TiptapNode {
  type: string;
  attrs?: Record<string, any>;
  content?: TiptapNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, any> }>;
}

export interface TiptapDocument {
  type: 'doc';
  content: TiptapNode[];
}

export class LatexSerializer {
  /**
   * Convert LaTeX to Tiptap JSON structure
   */
  fromLatex(latexContent: string): TiptapDocument {
    // Remove LaTeX document preamble if present
    let content = latexContent;

    // Extract content between \begin{document} and \end{document}
    const docMatch = content.match(/\\begin\{document\}([\s\S]*)\\end\{document\}/);
    if (docMatch) {
      content = docMatch[1].trim();
    }

    // Parse the content into nodes
    const nodes: TiptapNode[] = [];
    const lines = content.split('\n');
    let currentParagraph: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (!line) {
        if (currentParagraph.length > 0) {
          nodes.push(this.createParagraphNode(currentParagraph.join(' ')));
          currentParagraph = [];
        }
        continue;
      }

      // Sections
      if (line.startsWith('\\section{')) {
        if (currentParagraph.length > 0) {
          nodes.push(this.createParagraphNode(currentParagraph.join(' ')));
          currentParagraph = [];
        }
        const title = this.extractBraces(line, '\\section');
        nodes.push(this.createHeadingNode(title, 1));
        continue;
      }

      if (line.startsWith('\\subsection{')) {
        if (currentParagraph.length > 0) {
          nodes.push(this.createParagraphNode(currentParagraph.join(' ')));
          currentParagraph = [];
        }
        const title = this.extractBraces(line, '\\subsection');
        nodes.push(this.createHeadingNode(title, 2));
        continue;
      }

      if (line.startsWith('\\subsubsection{')) {
        if (currentParagraph.length > 0) {
          nodes.push(this.createParagraphNode(currentParagraph.join(' ')));
          currentParagraph = [];
        }
        const title = this.extractBraces(line, '\\subsubsection');
        nodes.push(this.createHeadingNode(title, 3));
        continue;
      }

      // Lists
      if (line.startsWith('\\begin{itemize}') || line.startsWith('\\begin{enumerate}')) {
        if (currentParagraph.length > 0) {
          nodes.push(this.createParagraphNode(currentParagraph.join(' ')));
          currentParagraph = [];
        }
        const listType = line.includes('itemize') ? 'bulletList' : 'orderedList';
        const listNode = this.parseList(lines, i, listType);
        nodes.push(listNode.node);
        i = listNode.endIndex;
        continue;
      }

      // Tables
      if (line.startsWith('\\begin{table}')) {
        if (currentParagraph.length > 0) {
          nodes.push(this.createParagraphNode(currentParagraph.join(' ')));
          currentParagraph = [];
        }
        const tableNode = this.parseTable(lines, i);
        if (tableNode.node) {
          nodes.push(tableNode.node);
        }
        i = tableNode.endIndex;
        continue;
      }

      // Regular content
      currentParagraph.push(line);
    }

    // Add remaining paragraph
    if (currentParagraph.length > 0) {
      nodes.push(this.createParagraphNode(currentParagraph.join(' ')));
    }

    return {
      type: 'doc',
      content: nodes.length > 0 ? nodes : [this.createParagraphNode('')]
    };
  }

  /**
   * Convert Tiptap JSON to LaTeX
   */
  toLatex(doc: TiptapDocument): string {
    let latex = '\\documentclass{article}\n';
    latex += '\\usepackage{amsmath}\n';
    latex += '\\usepackage{hyperref}\n'; // For links
    latex += '\\usepackage{soul}\n'; // For strikethrough and highlight
    latex += '\\usepackage{xcolor}\n'; // For colors
    latex += '\\begin{document}\n\n';

    if (doc.content) {
      for (const node of doc.content) {
        latex += this.nodeToLatex(node);
      }
    }

    latex += '\\end{document}\n';
    return latex;
  }

  /**
   * Convert a single node to LaTeX
   */
  private nodeToLatex(node: TiptapNode, indent = ''): string {
    switch (node.type) {
      case 'heading':
        const level = node.attrs?.level || 1;
        const commands = ['section', 'subsection', 'subsubsection'];
        const command = commands[level - 1] || 'section';
        const headingText = this.extractText(node);
        return `\\${command}{${headingText}}\n\n`;

      case 'paragraph':
        const paraText = this.extractText(node);
        if (!paraText.trim()) return '\n';
        return `${paraText}\n\n`;

      case 'bulletList':
        let bulletList = '\\begin{itemize}\n';
        if (node.content) {
          for (const item of node.content) {
            bulletList += this.nodeToLatex(item, '  ');
          }
        }
        bulletList += '\\end{itemize}\n\n';
        return bulletList;

      case 'orderedList':
        let orderedList = '\\begin{enumerate}\n';
        if (node.content) {
          for (const item of node.content) {
            orderedList += this.nodeToLatex(item, '  ');
          }
        }
        orderedList += '\\end{enumerate}\n\n';
        return orderedList;

      case 'listItem':
        const itemText = this.extractText(node);
        return `${indent}\\item ${itemText}\n`;

      case 'blockquote':
        let quote = '\\begin{quote}\n';
        if (node.content) {
          for (const child of node.content) {
            quote += this.nodeToLatex(child, '  ');
          }
        }
        quote += '\\end{quote}\n\n';
        return quote;

      case 'table':
        return this.tableToLatex(node);

      case 'inlineMath':
        return `$${node.attrs?.latex || ''}$`;

      case 'blockMath':
        return `$$${node.attrs?.latex || ''}$$\n\n`;

      case 'text':
        return this.formatText(node);

      case 'hardBreak':
        return '\\\\\n';

      default:
        return '';
    }
  }

  /**
   * Convert table node to LaTeX tabular
   */
  private tableToLatex(node: TiptapNode): string {
    if (!node.content || node.content.length === 0) return '';

    // Count columns from first row
    const firstRow = node.content[0];
    const colCount = firstRow.content?.length || 0;

    let latex = '\\begin{table}[h]\n';
    latex += '\\centering\n';
    latex += `\\begin{tabular}{${Array(colCount).fill('|c').join('')}|}\n`;
    latex += '\\hline\n';

    // Process rows
    for (let i = 0; i < node.content.length; i++) {
      const row = node.content[i];
      if (row.type === 'tableRow' && row.content) {
        const cells = row.content.map(cell => {
          // Handle both tableCell and tableHeader
          if (cell.type === 'tableCell' || cell.type === 'tableHeader') {
            const cellText = this.extractText(cell);
            return cellText.trim();
          }
          return '';
        }).filter(text => text !== '');
        if (cells.length > 0) {
          latex += cells.join(' & ') + ' \\\\\n';
          latex += '\\hline\n';
        }
      }
    }

    latex += '\\end{tabular}\n';
    latex += '\\end{table}\n\n';
    return latex;
  }

  /**
   * Extract text content from a node
   */
  private extractText(node: TiptapNode): string {
    if (node.text) {
      return this.formatText(node);
    }

    if (node.content) {
      return node.content.map(child => this.extractText(child)).join('');
    }

    // Handle math nodes
    if (node.type === 'inlineMath') {
      return `$${node.attrs?.latex || ''}$`;
    }
    if (node.type === 'blockMath') {
      return `$$${node.attrs?.latex || ''}$$`;
    }

    return '';
  }

  /**
   * Format text with marks (bold, italic, etc.)
   */
  private formatText(node: TiptapNode): string {
    if (!node.text) return '';

    let text = node.text;

    if (node.marks) {
      for (const mark of node.marks) {
        switch (mark.type) {
          case 'bold':
            text = `\\textbf{${text}}`;
            break;
          case 'italic':
            text = `\\textit{${text}}`;
            break;
          case 'underline':
            text = `\\underline{${text}}`;
            break;
          case 'code':
            text = `\\texttt{${text}}`;
            break;
          case 'strike':
            text = `\\st{${text}}`; // soul package
            break;
          case 'highlight':
            text = `\\hl{${text}}`; // soul package
            break;
          case 'link':
            const href = mark.attrs?.href || '';
            text = `\\href{${href}}{${text}}`;
            break;
        }
      }
    }

    return text;
  }

  /**
   * Create a paragraph node
   */
  private createParagraphNode(text: string): TiptapNode {
    const content: TiptapNode[] = [];

    // Parse inline content (math, formatting)
    const segments = this.parseInlineContent(text);

    for (const segment of segments) {
      content.push(segment);
    }

    return {
      type: 'paragraph',
      content: content.length > 0 ? content : [{ type: 'text', text: '' }]
    };
  }

  /**
   * Parse inline content including math and formatting
   */
  private parseInlineContent(text: string): TiptapNode[] {
    const nodes: TiptapNode[] = [];
    let current = '';
    let i = 0;

    while (i < text.length) {
      // Inline math: $...$
      if (text[i] === '$' && text[i + 1] !== '$') {
        if (current) {
          nodes.push(...this.parseFormatting(current));
          current = '';
        }

        let j = i + 1;
        while (j < text.length && text[j] !== '$') j++;

        if (j < text.length) {
          const latex = text.substring(i + 1, j);
          nodes.push({ type: 'inlineMath', attrs: { latex } });
          i = j + 1;
          continue;
        }
      }

      // Display math: $$...$$
      if (text[i] === '$' && text[i + 1] === '$') {
        if (current) {
          nodes.push(...this.parseFormatting(current));
          current = '';
        }

        let j = i + 2;
        while (j < text.length - 1 && !(text[j] === '$' && text[j + 1] === '$')) j++;

        if (j < text.length - 1) {
          const latex = text.substring(i + 2, j);
          nodes.push({ type: 'blockMath', attrs: { latex } });
          i = j + 2;
          continue;
        }
      }

      current += text[i];
      i++;
    }

    if (current) {
      nodes.push(...this.parseFormatting(current));
    }

    return nodes;
  }

  /**
   * Parse text formatting commands
   */
  private parseFormatting(text: string): TiptapNode[] {
    // Simple formatting parsing - can be enhanced
    const nodes: TiptapNode[] = [];

    // Bold
    text = text.replace(/\\textbf\{([^}]+)\}/g, (_, content) => {
      return `<BOLD>${content}</BOLD>`;
    });

    // Italic
    text = text.replace(/\\textit\{([^}]+)\}/g, (_, content) => {
      return `<ITALIC>${content}</ITALIC>`;
    });

    // For now, create a simple text node
    // In a more complete implementation, we'd parse the marks properly
    if (text) {
      nodes.push({ type: 'text', text });
    }

    return nodes;
  }

  /**
   * Create a heading node
   */
  private createHeadingNode(text: string, level: number): TiptapNode {
    return {
      type: 'heading',
      attrs: { level },
      content: [{ type: 'text', text }]
    };
  }

  /**
   * Parse a list (itemize or enumerate)
   */
  private parseList(lines: string[], startIndex: number, listType: string): { node: TiptapNode; endIndex: number } {
    const items: TiptapNode[] = [];
    let i = startIndex + 1;
    const endTag = listType === 'bulletList' ? '\\end{itemize}' : '\\end{enumerate}';

    while (i < lines.length) {
      const line = lines[i].trim();

      if (line.startsWith(endTag)) {
        break;
      }

      if (line.startsWith('\\item')) {
        const itemText = line.substring(5).trim();
        items.push({
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: itemText }]
            }
          ]
        });
      }

      i++;
    }

    return {
      node: {
        type: listType,
        content: items
      },
      endIndex: i
    };
  }

  /**
   * Parse a table environment
   */
  private parseTable(lines: string[], startIndex: number): { node: TiptapNode | null; endIndex: number } {
    let i = startIndex;
    let foundTabular = false;
    let tabularStartIndex = -1;
    let tabularEndIndex = -1;
    let tableEndIndex = -1;

    // Find the end of the table environment and locate tabular
    while (i < lines.length) {
      const line = lines[i].trim();
      
      if (line.startsWith('\\begin{tabular}')) {
        foundTabular = true;
        tabularStartIndex = i;
      } else if (line.startsWith('\\end{tabular}')) {
        tabularEndIndex = i;
      } else if (line.startsWith('\\end{table}')) {
        tableEndIndex = i;
        break;
      }
      
      i++;
    }

    if (!foundTabular || tabularStartIndex === -1 || tabularEndIndex === -1 || tableEndIndex === -1) {
      return { node: null, endIndex: tableEndIndex >= 0 ? tableEndIndex : i };
    }

    // Extract tabular environment
    const tabularLines = lines.slice(tabularStartIndex, tabularEndIndex + 1);
    const tabularContent = tabularLines.join('\n');

    // Parse column specification
    const colSpecMatch = tabularContent.match(/\\begin\{tabular\}\{([^}]+)\}/);
    if (!colSpecMatch) {
      return { node: null, endIndex: tableEndIndex };
    }

    const colSpec = colSpecMatch[1];
    // Count columns from spec (|c|c|c| -> 3 columns)
    const columns = colSpec.split('|').filter(col => col.trim() !== '');
    const colCount = columns.length > 0 ? columns.length : 1;

    // Extract tabular body (between \begin{tabular} and \end{tabular})
    const tabularBodyMatch = tabularContent.match(/\\begin\{tabular\}\{[^}]+\}([\s\S]*)\\end\{tabular\}/);
    if (!tabularBodyMatch) {
      return { node: null, endIndex: tableEndIndex };
    }

    const tabularBody = tabularBodyMatch[1];

    // Parse rows
    const rows: TiptapNode[] = [];
    const rawRows = tabularBody.split('\\\\');
    let isFirstDataRow = true;
    
    for (const rawRow of rawRows) {
      const trimmed = rawRow.trim();
      if (!trimmed || trimmed === '\\hline') continue;
      
      // Remove \hline from start/end
      let cleanRow = trimmed.replace(/^\\hline\s*/, '').replace(/\s*\\hline$/, '');
      cleanRow = cleanRow.replace(/\n/g, ' ').trim();
      if (!cleanRow) continue;
      
      // Split by & to get cells
      const cells = cleanRow.split('&').map(cell => cell.trim());
      if (cells.length === 0 || cells.every(c => c === '')) continue;

      // Create table cells - first row uses tableHeader, others use tableCell
      const tableCells: TiptapNode[] = [];
      const cellType = isFirstDataRow ? 'tableHeader' : 'tableCell';
      
      for (let j = 0; j < Math.max(cells.length, colCount); j++) {
        const cellText = cells[j] || '';
        // Parse cell content for formatting and math
        const cellContent = this.parseInlineContent(cellText);
        // Table cells must contain block nodes (paragraphs), not inline nodes directly
        tableCells.push({
          type: cellType,
          content: [{
            type: 'paragraph',
            content: cellContent.length > 0 ? cellContent : [{ type: 'text', text: '' }]
          }]
        });
      }

      rows.push({
        type: 'tableRow',
        content: tableCells
      });
      
      isFirstDataRow = false; // After first row, all subsequent rows are data rows
    }

    if (rows.length === 0) {
      return { node: null, endIndex: tableEndIndex };
    }

    return {
      node: {
        type: 'table',
        content: rows
      },
      endIndex: tableEndIndex
    };
  }

  /**
   * Extract content from braces
   */
  private extractBraces(text: string, command: string): string {
    const start = text.indexOf('{', command.length);
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      return text.substring(start + 1, end);
    }
    return '';
  }
}

// Export a singleton instance
export const latexSerializer = new LatexSerializer();
