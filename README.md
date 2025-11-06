# KishEditor - Client-Side LaTeX Editor

A lightweight, client-side LaTeX editor with live preview and **WYSIWYG mode** that can be easily integrated into any React project. Built with React, TypeScript, CodeMirror 6, Tiptap, MathLive, and KaTeX.

## About the Name

**KishEditor** is named in tribute to the historic **Kish tablet**, one of the earliest known examples of proto-writing, dating back to approximately **3500 BCE**. Discovered in the ruins of the Sumerian city of Kish (located in present-day Iraq), this limestone tablet features pictographic symbols that represent a pivotal transitional phase between proto-writing and the more sophisticated cuneiform script.

![Kish Tablet](assets/kish-tablet.png)

*The Kish tablet, one of the earliest known examples of writing. The original limestone tablet is housed at the Ashmolean Museum, Oxford.*

The Kish tablet marks a monumental moment in the history of human communication, illustrating the evolution from simple pictographs to complex writing systems. The symbols on the tablet, though not fully deciphered, are believed to depict various objects and activities, reflecting the administrative and economic practices of ancient Mesopotamia.

By naming our project after this historic artifact, we honor the origins of written communication and draw inspiration from humanity's enduring quest to record, preserve, and share knowledge—a mission that continues in the digital age through tools like KishEditor.

## Features

- **WYSIWYG Editor**: Visual editing with formatting toolbar (NEW!)
- **Dual Mode**: Switch between Source and WYSIWYG modes seamlessly (NEW!)
- **Visual Math Editor**: MathLive integration for intuitive equation editing (NEW!)
- **Real-time Preview**: Live LaTeX rendering as you type
- **Syntax Highlighting**: Full LaTeX syntax support via CodeMirror 6
- **Math Rendering**: Beautiful math equations via KaTeX
- **Client-Side**: No server required - everything runs in the browser
- **Easy Integration**: Simple React components that work out of the box
- **TypeScript Support**: Full type definitions included
- **Extensible**: Easy to customize and extend

## Installation

```bash
npm install kish-editor
# or
yarn add kish-editor
```

For local development:

```bash
npm install
npm run dev
```

## Quick Start

### WYSIWYG Mode with Source Toggle (Recommended)

```tsx
import React from 'react';
import { DualModeEditor } from 'kish-editor';
import 'kish-editor/dist/style.css'; // Import styles

function App() {
  const [content, setContent] = React.useState(`
\\documentclass{article}
\\begin{document}
\\section{Hello World}
This is a sample document with $E = mc^2$!
\\end{document}
  `);

  return (
    <DualModeEditor
      initialContent={content}
      onChange={setContent}
      height="600px"
      initialMode="wysiwyg" // or "source"
      showPreview={true}
    />
  );
}
```

### WYSIWYG Editor Only

```tsx
import React from 'react';
import { WysiwygEditor } from 'kish-editor';

function App() {
  return (
    <WysiwygEditor
      initialContent="\\section{Hello World}"
      onChange={(latex) => console.log(latex)}
      height="600px"
    />
  );
}
```

### Basic Usage - Combined Editor with Preview

```tsx
import React from 'react';
import { LatexEditorWithPreview } from 'kish-editor';

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
import { LatexEditor, LatexPreview } from 'kish-editor';

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
import { LatexEditor } from 'kish-editor';

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

### DualModeEditor (NEW!)

Complete editor with WYSIWYG and Source mode toggle.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialContent` | `string` | `''` | Initial LaTeX content |
| `onChange` | `(content: string) => void` | - | Callback when content changes |
| `height` | `string` | `'600px'` | Height of the component |
| `className` | `string` | `''` | Custom CSS class |
| `initialMode` | `'source' \| 'wysiwyg'` | `'source'` | Initial editor mode |
| `onModeChange` | `(mode: EditorMode) => void` | - | Callback when mode changes |
| `showPreview` | `boolean` | `true` | Show/hide preview panel |

### WysiwygEditor (NEW!)

Visual WYSIWYG editor with formatting toolbar.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialContent` | `string` | `''` | Initial LaTeX content |
| `onChange` | `(content: string) => void` | - | Callback when content changes |
| `height` | `string` | `'600px'` | Height of the editor |
| `className` | `string` | `''` | Custom CSS class |
| `readOnly` | `boolean` | `false` | Read-only mode |

**Features:**
- Text formatting (bold, italic, underline, code)
- Headings (H1, H2, H3)
- Lists (bullet and numbered)
- Visual math equation editor (MathLive)
- Undo/redo support

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
import { LatexRenderer } from 'kish-editor';

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
import { LatexEditorWithPreview } from 'kish-editor';

function MyEditor() {
  return <LatexEditorWithPreview />;
}
```

### Using with Next.js

```tsx
'use client'; // Add this for Next.js 13+ app router

import dynamic from 'next/dynamic';

const LatexEditor = dynamic(
  () => import('kish-editor').then(mod => mod.LatexEditorWithPreview),
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
