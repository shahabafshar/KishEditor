# Features

KishEditor provides a comprehensive set of features for LaTeX document editing. This document outlines all available features organized by category.

## Editing Modes

### Source Mode
- **LaTeX Syntax Highlighting**: Full LaTeX syntax support via CodeMirror 6
- **Code Editing**: Professional code editor with line numbers, search, and more
- **Auto-indentation**: Automatic indentation for LaTeX structures
- **Line Wrapping**: Optional line wrapping for better readability
- **Read-only Mode**: Support for read-only viewing

### WYSIWYG Mode
- **Visual Editing**: Edit documents visually without knowing LaTeX syntax
- **Formatting Toolbar**: Rich formatting toolbar with common formatting options
- **Inline Editing**: Edit content directly in the document
- **Visual Math Editor**: Insert and edit math equations visually
- **Undo/Redo**: Full undo/redo support

### Dual Mode
- **Mode Switching**: Seamless switching between Source and WYSIWYG modes
- **Content Sync**: Content automatically syncs between modes
- **Mode Persistence**: Remembers your preferred mode

## Text Formatting

### Basic Formatting
- **Bold Text**: `\textbf{}` or toolbar button
- **Italic Text**: `\textit{}` or toolbar button
- **Underline**: `\underline{}` or toolbar button
- **Monospace**: `\texttt{}` or code button

### Headings
- **Section**: `\section{}` or H1 button
- **Subsection**: `\subsection{}` or H2 button
- **Subsubsection**: `\subsubsection{}` or H3 button
- **Paragraph**: Normal paragraph formatting

### Lists
- **Bullet Lists**: `\begin{itemize}...\end{itemize}` or bullet list button
- **Numbered Lists**: `\begin{enumerate}...\end{enumerate}` or numbered list button
- **Nested Lists**: Support for nested list structures

## Mathematical Content

### Math Rendering
- **Inline Math**: `$...$` or `\(...\)` syntax
- **Display Math**: `$$...$$` or `\[...\]` syntax
- **KaTeX Support**: Full KaTeX feature set
- **Custom Macros**: Support for custom LaTeX macros

### Math Editor
- **Visual Math Input**: MathLive-based equation editor
- **Virtual Keyboard**: On-screen math keyboard
- **Live Preview**: Real-time preview of math equations
- **Inline/Display Modes**: Support for both inline and display math

## Document Structure

### Document Environment
- **Document Class**: Support for `\documentclass{}`
- **Preamble**: Support for document preamble (packages, etc.)
- **Document Body**: `\begin{document}...\end{document}` structure

### Sections and Structure
- **Sections**: Hierarchical section structure
- **Paragraphs**: Automatic paragraph handling
- **Line Breaks**: `\\` for manual line breaks
- **Comments**: `%` for LaTeX comments

## Advanced Features

### Tables
- **Table Creation**: Insert tables via toolbar
- **Table Editing**: Edit table cells inline
- **Table Formatting**: Borders, alignment, and styling
- **LaTeX Conversion**: Converts to `tabular` environment

### Links
- **Hyperlinks**: Insert and edit hyperlinks
- **URL Support**: Support for URLs and custom link text
- **LaTeX Conversion**: Converts to `\href{}` command

### Block Quotes
- **Quote Blocks**: Support for block quotes
- **Styling**: Customizable quote block styling

## Preview Features

### Real-Time Preview
- **Live Rendering**: Updates as you type
- **Debounced Updates**: Configurable debounce delay
- **Error Handling**: Graceful error handling for invalid LaTeX
- **Split-Pane View**: Side-by-side editing and preview

### Preview Options
- **Toggle Preview**: Show/hide preview panel
- **Full-Screen Preview**: Optional full-screen preview mode
- **Preview Styling**: Customizable preview appearance

## Integration Features

### React Integration
- **React Components**: Standard React components
- **Props API**: Comprehensive props interface
- **TypeScript Support**: Full TypeScript definitions
- **Hooks Support**: Works with React hooks

### Customization
- **Styling**: Customizable CSS classes
- **Theming**: Support for custom themes
- **Configuration**: Extensive configuration options
- **Extensibility**: Easy to extend with custom features

## Performance Features

### Optimization
- **Debounced Rendering**: Configurable debounce for preview updates
- **Lazy Loading**: Components load on demand
- **Efficient Updates**: Only updates changed content
- **Large Document Support**: Handles large documents efficiently

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Support**: Basic support for mobile browsers
- **Accessibility**: Keyboard navigation and screen reader support

## Developer Features

### TypeScript
- **Full Type Definitions**: Complete TypeScript support
- **Type Safety**: Type-safe component props
- **IntelliSense**: Full IDE support

### Build System
- **Library Build**: Build as reusable library
- **Demo Build**: Build demo application
- **Development Mode**: Fast development with hot reload
- **Production Build**: Optimized production builds

## Future Features (Roadmap)

- 🔄 **PDF Export**: Client-side PDF generation
- 🔄 **More LaTeX Packages**: Extended package support
- 🔄 **Autocomplete**: LaTeX command autocomplete
- 🔄 **Collaborative Editing**: Real-time collaboration
- 🔄 **Template Library**: Pre-built document templates
- 🔄 **Dark Mode**: Dark theme support
- 🔄 **File Management**: Project/file tree management
- 🔄 **Version History**: Document versioning
- 🔄 **Export Formats**: Export to various formats

## Feature Comparison

| Feature | Source Mode | WYSIWYG Mode | Notes |
|---------|------------|--------------|-------|
| Text Editing | ✅ | ✅ | Both modes support text editing |
| Syntax Highlighting | ✅ | ❌ | Only in source mode |
| Visual Formatting | ❌ | ✅ | Only in WYSIWYG mode |
| Math Editor | ❌ | ✅ | Visual math editor in WYSIWYG |
| LaTeX Knowledge Required | ✅ | ❌ | WYSIWYG doesn't require LaTeX knowledge |
| Full LaTeX Control | ✅ | ⚠️ | Source mode has full control |
| Beginner Friendly | ❌ | ✅ | WYSIWYG is more beginner-friendly |

---

For detailed usage instructions, see the [Usage Examples](../guides/usage-examples.md) guide.

