# Core Libraries

This document describes the core libraries and dependencies used in KishEditor and how they're integrated.

## Primary Dependencies

### React & React DOM

**Version**: ^18.3.1

**Purpose**: UI framework

**Usage**:
- All components are React functional components
- Uses React hooks (`useState`, `useEffect`, `useCallback`, `useRef`)
- No class components

**Key Features Used**:
- Functional components
- Hooks API
- Context API (potential future use)

### TypeScript

**Version**: ^5.6.3

**Purpose**: Type safety and developer experience

**Usage**:
- All source files are TypeScript
- Full type definitions exported
- Strict mode enabled

**Configuration**:
- Target: ES2020
- Module: ESNext
- JSX: react-jsx
- Module Resolution: bundler

## Editing Libraries

### CodeMirror 6

**Versions**:
- `codemirror`: ^6.0.1
- `@codemirror/state`: ^6.4.0
- `@codemirror/view`: ^6.23.0
- `@codemirror/commands`: ^6.3.3
- `@codemirror/language`: ^6.10.0
- `@codemirror/autocomplete`: ^6.12.0
- `@codemirror/lang-javascript`: ^6.2.1

**Purpose**: Source code editor for LaTeX

**Integration**:
- Custom LaTeX language definition (`latex-lang.ts`)
- Used in `LatexEditor` component
- Provides syntax highlighting and code editing

**Key Features Used**:
- Basic setup (line numbers, search, etc.)
- Custom language support
- Editor state management
- Change event handling

**Custom Implementation**:
```typescript
// latex-lang.ts
export function latex() {
  return LanguageSupport.define(latexLanguage);
}
```

### Tiptap

**Versions**:
- `@tiptap/react`: ^3.10.2
- `@tiptap/starter-kit`: ^3.10.2
- `@tiptap/extension-mathematics`: ^3.10.2
- `@tiptap/extension-underline`: ^3.10.2
- `@tiptap/extension-placeholder`: ^3.10.2
- `@tiptap/extension-table`: ^3.10.2
- `@tiptap/extension-table-cell`: ^3.10.2
- `@tiptap/extension-table-header`: ^3.10.2
- `@tiptap/extension-table-row`: ^3.10.2
- `@tiptap/extension-link`: ^3.10.2
- `@tiptap/extension-blockquote`: ^3.10.2
- `@tiptap/extension-color`: ^3.10.2
- `@tiptap/extension-highlight`: ^3.10.2
- `@tiptap/extension-text-style`: ^3.10.2

**Purpose**: WYSIWYG editor framework

**Integration**:
- Used in `WysiwygEditor` component
- Multiple extensions for rich editing
- React integration via `@tiptap/react`

**Extensions Used**:
- **StarterKit**: Basic editing (bold, italic, headings, lists, etc.)
- **Mathematics**: Math equation support
- **Underline**: Underline formatting
- **Table**: Table editing
- **Link**: Hyperlink support
- **Blockquote**: Quote blocks
- **Color**: Text color
- **Highlight**: Text highlighting
- **Placeholder**: Placeholder text

**Key Features Used**:
- Editor instance management (`useEditor` hook)
- Content serialization
- Extension system
- React integration

### MathLive

**Version**: ^0.107.1

**Purpose**: Visual math equation editor

**Integration**:
- Used in `MathInputDialog` component
- Provides interactive math input
- Generates LaTeX from visual input

**Key Features Used**:
- MathfieldElement for math input
- Virtual keyboard
- LaTeX generation
- Inline and display modes

**Usage**:
```typescript
import { MathfieldElement } from 'mathlive';

const mathfield = new MathfieldElement();
mathfield.setValue(latex);
mathfield.addEventListener('input', handleInput);
```

## Rendering Libraries

### KaTeX

**Version**: ^0.16.9

**Purpose**: Fast math rendering

**Integration**:
- Used in `LatexRenderer` class
- Renders inline and display math
- Used in preview components

**Key Features Used**:
- `renderToString()` for HTML generation
- Custom macros support
- Error handling
- Display and inline modes

**Usage**:
```typescript
import katex from 'katex';

const html = katex.renderToString('E = mc^2', {
  throwOnError: false,
  displayMode: false
});
```

### LaTeX.js

**Version**: ^0.12.6

**Purpose**: LaTeX document parsing

**Integration**:
- Used for parsing LaTeX document structure
- Helps with document processing
- Used in `LatexRenderer`

**Key Features Used**:
- Document parsing
- Structure extraction
- Environment handling

## Build Tools

### Vite

**Version**: ^6.0.3

**Purpose**: Build tool and dev server

**Configuration**:
- Library mode for package build
- Demo mode for development
- React plugin integration
- TypeScript support

**Key Features Used**:
- Fast HMR (Hot Module Replacement)
- Library bundling
- TypeScript compilation
- CSS processing

### vite-plugin-dts

**Version**: ^4.3.0

**Purpose**: Generate TypeScript declaration files

**Usage**:
- Automatically generates `.d.ts` files
- Includes type definitions in package
- Used in library build mode

## Development Dependencies

### ESLint

**Version**: ^9.15.0

**Purpose**: Code linting

**Plugins**:
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`

### Type Definitions

**Versions**:
- `@types/react`: ^18.3.12
- `@types/react-dom`: ^18.3.1
- `@types/katex`: ^0.16.7

**Purpose**: TypeScript type definitions for libraries

## Library Size Considerations

### Bundle Analysis

**Core Libraries** (approximate sizes):
- React + ReactDOM: ~130KB (gzipped)
- CodeMirror 6: ~200KB (gzipped)
- Tiptap: ~150KB (gzipped)
- MathLive: ~300KB (gzipped)
- KaTeX: ~100KB (gzipped)

**Total**: ~880KB (gzipped) for full editor

### Optimization Strategies

1. **Code Splitting**: Components can be lazy-loaded
2. **Tree Shaking**: Unused code is eliminated
3. **Dynamic Imports**: Large libraries load on demand
4. **Debouncing**: Reduces rendering frequency

## Library Alternatives Considered

### CodeMirror Alternatives
- **Monaco Editor**: Larger, more features, but heavier
- **Ace Editor**: Older, less maintained
- **Choice**: CodeMirror 6 for modern API and good LaTeX support

### Tiptap Alternatives
- **Draft.js**: Facebook's editor, but less maintained
- **Slate.js**: More flexible but more complex
- **Choice**: Tiptap for React integration and extensibility

### MathLive Alternatives
- **MathQuill**: Older, less features
- **Custom Solution**: Too complex to build
- **Choice**: MathLive for best-in-class math input

### KaTeX Alternatives
- **MathJax**: More features but slower
- **Choice**: KaTeX for speed and performance

## Version Compatibility

### React
- Requires React 18+
- Uses modern hooks API
- Compatible with React 18.3+

### TypeScript
- Requires TypeScript 5.6+
- Uses modern TypeScript features
- Compatible with strict mode

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020 features required
- No IE11 support

## Future Library Considerations

### Potential Additions
- **PDF.js**: For PDF export (client-side)
- **Collaborative Libraries**: For real-time collaboration
- **Template Libraries**: For document templates

### Potential Replacements
- None currently planned
- Libraries are well-maintained
- Good community support

For more details on how libraries are used, see [Technical Architecture](./architecture.md).

