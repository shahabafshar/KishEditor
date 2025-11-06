# Getting Started

This guide will help you get started with KishEditor quickly.

## Installation

### As a Package (Recommended)

```bash
npm install kish-editor
# or
yarn add kish-editor
# or
pnpm add kish-editor
```

### Local Development

```bash
# Clone or download the repository
cd KishEditor

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the demo.

## Basic Usage

### Minimal Example

```tsx
import React from 'react';
import { DualModeEditor } from 'kish-editor';
import 'kish-editor/dist/style.css';

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
    />
  );
}

export default App;
```

### Source Mode Only

```tsx
import { LatexEditor } from 'kish-editor';

function App() {
  return (
    <LatexEditor
      initialContent="\\section{Hello}"
      onChange={(content) => console.log(content)}
      height="400px"
    />
  );
}
```

### WYSIWYG Mode Only

```tsx
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

### Editor with Preview

```tsx
import { LatexEditorWithPreview } from 'kish-editor';

function App() {
  const [content, setContent] = React.useState('');

  return (
    <LatexEditorWithPreview
      initialContent={content}
      onChange={setContent}
      height="600px"
      showPreview={true}
    />
  );
}
```

## Next Steps

1. **Explore Components**: See [Components API](../api/components.md) for all available components
2. **Customize Styling**: Check [Customization Guide](../guides/customization.md)
3. **Integration**: Read [Integration Guide](../guides/integration.md) for framework-specific instructions
4. **Examples**: Browse [Usage Examples](../guides/usage-examples.md) for more patterns

## Common Patterns

### Saving Content

```tsx
import { useState, useEffect } from 'react';
import { DualModeEditor } from 'kish-editor';

function EditorWithSave() {
  const [content, setContent] = useState('');

  const handleSave = async () => {
    await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  };

  return (
    <>
      <DualModeEditor
        initialContent={content}
        onChange={setContent}
      />
      <button onClick={handleSave}>Save</button>
    </>
  );
}
```

### Loading from Storage

```tsx
import { useState, useEffect } from 'react';
import { DualModeEditor } from 'kish-editor';

function PersistentEditor() {
  const [content, setContent] = useState(() => {
    return localStorage.getItem('latex-content') || '';
  });

  useEffect(() => {
    localStorage.setItem('latex-content', content);
  }, [content]);

  return (
    <DualModeEditor
      initialContent={content}
      onChange={setContent}
    />
  );
}
```

### Error Handling

```tsx
import { DualModeEditor } from 'kish-editor';

function EditorWithErrorHandling() {
  return (
    <DualModeEditor
      initialContent="..."
      onChange={(content) => {
        try {
          // Process content
        } catch (error) {
          console.error('Error:', error);
        }
      }}
      onPreviewError={(error) => {
        console.error('Preview error:', error);
        // Show error notification to user
      }}
    />
  );
}
```

## Troubleshooting

### Styles Not Loading

Make sure to import the CSS:

```tsx
import 'kish-editor/dist/style.css';
```

### TypeScript Errors

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "esModuleInterop": true
  }
}
```

### Next.js SSR Issues

Use dynamic imports with `ssr: false`:

```tsx
import dynamic from 'next/dynamic';

const DualModeEditor = dynamic(
  () => import('kish-editor').then(mod => mod.DualModeEditor),
  { ssr: false }
);
```

For more troubleshooting help, see the [Troubleshooting Guide](../guides/troubleshooting.md).

## Resources

- **Main README**: [../../README.md](../../README.md)
- **Quick Start**: [../../QUICKSTART.md](../../QUICKSTART.md)
- **API Reference**: [../api/components.md](../api/components.md)
- **Examples**: [../guides/usage-examples.md](../guides/usage-examples.md)

