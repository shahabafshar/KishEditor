# OverLeaf Clone - Client-Side LaTeX Editor

A lightweight, client-side LaTeX editor with live preview that can be easily integrated into any React project. Built with React, TypeScript, CodeMirror 6, and KaTeX.

## Features

- **Real-time Preview**: Live LaTeX rendering as you type
- **Syntax Highlighting**: Full LaTeX syntax support via CodeMirror 6
- **Math Rendering**: Beautiful math equations via KaTeX
- **Client-Side**: No server required - everything runs in the browser
- **Easy Integration**: Simple React components that work out of the box
- **TypeScript Support**: Full type definitions included
- **Extensible**: Easy to customize and extend

## Installation

```bash
npm install overleaf-clone
# or
yarn add overleaf-clone
```

For local development:

```bash
npm install
npm run dev
```

## Quick Start

### Basic Usage - Combined Editor with Preview

```tsx
import React from 'react';
import { LatexEditorWithPreview } from 'overleaf-clone';

function App() {
  const [content, setContent] = React.useState(`
\\documentclass{article}
\\begin{document}
Hello World! $E = mc^2$
\\end{document}
  `);

  return (
    <LatexEditorWithPreview
      initialContent={content}
      onChange={setContent}
      height="600px"
    />
  );
}
```

### Separate Editor and Preview

```tsx
import React from 'react';
import { LatexEditor, LatexPreview } from 'overleaf-clone';

function App() {
  const [content, setContent] = React.useState('');

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <LatexEditor
        initialContent={content}
        onChange={setContent}
        height="600px"
      />
      <LatexPreview
        content={content}
        height="600px"
      />
    </div>
  );
}
```

### Editor Only

```tsx
import React from 'react';
import { LatexEditor } from 'overleaf-clone';

function App() {
  return (
    <LatexEditor
      initialContent="\\section{Hello World}"
      onChange={(newContent) => console.log(newContent)}
      height="400px"
    />
  );
}
```

## Components

### LatexEditorWithPreview

Complete editor with split-pane preview.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialContent` | `string` | `''` | Initial LaTeX content |
| `onChange` | `(content: string) => void` | - | Callback when content changes |
| `height` | `string` | `'600px'` | Height of the component |
| `className` | `string` | `''` | Custom CSS class |
| `showPreview` | `boolean` | `true` | Show/hide preview panel |
| `onPreviewError` | `(error: Error) => void` | - | Callback for preview errors |
| `previewDebounce` | `number` | `500` | Debounce delay for preview (ms) |

### LatexEditor

CodeMirror-based LaTeX editor.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialContent` | `string` | `''` | Initial LaTeX content |
| `onChange` | `(content: string) => void` | - | Callback when content changes |
| `height` | `string` | `'600px'` | Height of the editor |
| `className` | `string` | `''` | Custom CSS class |
| `readOnly` | `boolean` | `false` | Read-only mode |

### LatexPreview

Preview component for rendering LaTeX.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | - | LaTeX content to render |
| `height` | `string` | `'600px'` | Height of the preview |
| `className` | `string` | `''` | Custom CSS class |
| `onError` | `(error: Error) => void` | - | Callback for rendering errors |

## Advanced Usage

### Custom Debounce

Control how often the preview updates:

```tsx
<LatexEditorWithPreview
  initialContent={content}
  onChange={setContent}
  previewDebounce={1000} // Update preview 1 second after typing stops
/>
```

### Error Handling

```tsx
<LatexEditorWithPreview
  initialContent={content}
  onChange={setContent}
  onPreviewError={(error) => {
    console.error('Preview rendering failed:', error);
    // Show error notification to user
  }}
/>
```

### Using the Renderer Directly

```tsx
import { LatexRenderer } from 'overleaf-clone';

const renderer = new LatexRenderer({
  strict: false,
  throwOnError: false,
  macros: {
    '\\R': '\\mathbb{R}'
  }
});

const html = renderer.render('$x \\in \\R$');
```

## Integration into Existing Projects

### As a Component Library

1. Install the package in your project
2. Import the components you need
3. Use them like any other React component

```tsx
import { LatexEditorWithPreview } from 'overleaf-clone';

function MyEditor() {
  return <LatexEditorWithPreview />;
}
```

### Using with Next.js

```tsx
'use client'; // Add this for Next.js 13+ app router

import dynamic from 'next/dynamic';

const LatexEditor = dynamic(
  () => import('overleaf-clone').then(mod => mod.LatexEditorWithPreview),
  { ssr: false }
);

export default function Page() {
  return <LatexEditor />;
}
```

### Styling

The components come with default styles. You can customize them by:

1. **Using className prop:**
   ```tsx
   <LatexEditorWithPreview className="my-custom-editor" />
   ```

2. **Overriding CSS:**
   ```css
   .latex-split-view {
     background-color: #f0f0f0;
   }
   ```

## Supported LaTeX Features

### Document Structure
- `\section{}`, `\subsection{}`, `\subsubsection{}`
- `\begin{document}...\end{document}`

### Math
- Inline: `$...$` or `\(...\)`
- Display: `$$...$$` or `\[...\]`
- Full KaTeX feature set

### Environments
- `itemize` (unordered lists)
- `enumerate` (ordered lists)
- `verbatim` (code blocks)
- `center`

### Text Formatting
- `\textbf{}` - Bold
- `\textit{}` - Italic
- `\emph{}` - Emphasis
- `\underline{}` - Underline
- `\texttt{}` - Monospace

### Special Commands
- `\\` - Line break
- `%` - Comments

## Extensibility

### Adding Server-Side Compilation

The architecture supports extending to server-side compilation:

```tsx
function EditorWithServerCompile() {
  const [content, setContent] = React.useState('');
  const [serverPdf, setServerPdf] = React.useState<Blob>();

  const compilePdf = async () => {
    const response = await fetch('/api/compile', {
      method: 'POST',
      body: JSON.stringify({ latex: content })
    });
    const blob = await response.blob();
    setServerPdf(blob);
  };

  return (
    <>
      <LatexEditorWithPreview
        initialContent={content}
        onChange={setContent}
      />
      <button onClick={compilePdf}>Compile to PDF</button>
    </>
  );
}
```

### Custom LaTeX Packages

Extend the renderer to support custom packages:

```tsx
const customRenderer = new LatexRenderer({
  macros: {
    '\\mycommand': '\\textbf{Custom Command}'
  }
});
```

## Development

### Running the Demo

```bash
npm install
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

### Building

```bash
# Build library
npm run build:lib

# Build demo
npm run build
```

### Project Structure

```
src/
├── components/       # React components
│   ├── LatexEditor.tsx
│   ├── LatexPreview.tsx
│   └── LatexEditorWithPreview.tsx
├── lib/             # Core functionality
│   ├── latex-lang.ts      # CodeMirror language support
│   ├── latex-renderer.ts  # LaTeX to HTML renderer
│   └── hooks.ts           # React hooks
├── types/           # TypeScript definitions
├── styles/          # CSS styles
└── demo/            # Demo application
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Dependencies

- React 18+
- CodeMirror 6
- KaTeX 0.16+

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Future Enhancements

- [ ] File tree/project management
- [ ] Export to PDF (client-side)
- [ ] More LaTeX packages support
- [ ] Autocomplete for LaTeX commands
- [ ] Collaborative editing
- [ ] Template library
- [ ] Dark mode

## Credits

Built with:
- [React](https://react.dev/)
- [CodeMirror](https://codemirror.net/)
- [KaTeX](https://katex.org/)
- [Vite](https://vitejs.dev/)
