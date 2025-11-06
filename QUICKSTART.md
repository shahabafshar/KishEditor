# Quick Start Guide

Get up and running with KishEditor in minutes!

## 1. Run the Demo Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to see the demo.

## 2. Build for Production

```bash
# Build the demo application
npm run build

# Preview the production build
npm run preview

# Build as a library (for use in other projects)
npm run build:lib
```

## 3. Use in Your Project

### Install

```bash
npm install kish-editor
```

### Basic Usage

```tsx
import { LatexEditorWithPreview } from 'kish-editor';

function App() {
  return (
    <LatexEditorWithPreview
      initialContent="\section{Hello World}"
      height="100vh"
    />
  );
}
```

## 4. Customize

```tsx
import { LatexEditorWithPreview } from 'kish-editor';

function CustomEditor() {
  const [content, setContent] = React.useState('');

  return (
    <LatexEditorWithPreview
      initialContent={content}
      onChange={setContent}
      height="600px"
      previewDebounce={300}
      onPreviewError={(error) => console.error(error)}
    />
  );
}
```

## 5. What's Included

- **Editor Component** - CodeMirror 6 with LaTeX syntax highlighting
- **Preview Component** - Real-time LaTeX rendering with KaTeX
- **Combined Component** - Split-pane view with both editor and preview
- **Demo Application** - Full working example
- **TypeScript Support** - Complete type definitions

## Sample LaTeX Templates

The demo includes three templates:

1. **Simple Example** - Basic document structure
2. **Article Template** - Full article with sections, lists, and formatting
3. **Math Formulas** - Mathematical expressions and equations

## Next Steps

- Check out [README.md](./README.md) for full documentation
- See [INTEGRATION.md](./INTEGRATION.md) for integration examples
- Explore the demo at `src/demo/` for usage examples
- Customize styles in `src/styles/` to match your design

## Project Structure

```
src/
├── components/           # React components
│   ├── LatexEditor.tsx
│   ├── LatexPreview.tsx
│   └── LatexEditorWithPreview.tsx
├── lib/                 # Core functionality
│   ├── latex-lang.ts           # CodeMirror language
│   ├── latex-renderer.ts       # LaTeX renderer
│   └── hooks.ts                # React hooks
├── types/              # TypeScript definitions
├── styles/             # CSS styles
└── demo/               # Demo application
```

## Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

```bash
# Use a different port
npm run dev -- --port 3000
```

### TypeScript Errors

Ensure your tsconfig.json has:
```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "bundler"
  }
}
```

## Support

- For bugs or feature requests, open an issue on GitHub
- For questions, check the documentation files
- For integration help, see INTEGRATION.md

## License

MIT - Feel free to use in your projects!
