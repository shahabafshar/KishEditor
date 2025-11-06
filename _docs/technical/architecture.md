# Technical Architecture

This document provides detailed technical information about KishEditor's architecture.

## Component Architecture

### Component Hierarchy

```
DualModeEditor (Root Component)
│
├── Mode Switcher UI
│   ├── Source Button
│   └── WYSIWYG Button
│
├── Editor Container
│   ├── Source Mode Branch
│   │   └── LatexEditor
│   │       └── CodeMirror 6 Instance
│   │
│   └── WYSIWYG Mode Branch
│       └── WysiwygEditor
│           ├── WysiwygToolbar
│           └── Tiptap Editor Instance
│               └── MathInputDialog (Modal)
│
└── Preview Container (Optional)
    └── LatexPreview
        └── LatexRenderer Instance
            └── KaTeX Renderer
```

## Core Components

### DualModeEditor

**Purpose**: Main component that orchestrates mode switching and content synchronization.

**Responsibilities**:
- Manage editor mode state (source/wysiwyg)
- Synchronize content between modes
- Render appropriate editor component based on mode
- Handle mode change events

**Key Implementation Details**:
- Uses React keys to force remounting when switching modes
- Maintains single source of truth for content
- Uses `LatexSerializer` for mode conversion

### LatexEditor

**Purpose**: Source code editor for LaTeX.

**Technology**: CodeMirror 6

**Key Features**:
- LaTeX syntax highlighting via custom language definition
- Line numbers and code editing features
- Read-only mode support
- Change event handling

**Implementation**:
```typescript
// Simplified structure
const state = EditorState.create({
  doc: initialContent,
  extensions: [
    basicSetup,
    latex(), // Custom LaTeX language
    EditorView.lineWrapping,
    updateListener
  ]
});
```

### WysiwygEditor

**Purpose**: Visual editor for LaTeX documents.

**Technology**: Tiptap (built on ProseMirror)

**Key Features**:
- Rich text formatting
- Math node support
- Toolbar integration
- LaTeX serialization

**Extensions Used**:
- StarterKit (basic editing)
- Mathematics (math support)
- Underline, Color, Highlight
- Table, Link, Blockquote

### LatexPreview

**Purpose**: Render LaTeX content as HTML.

**Technology**: KaTeX + Custom Renderer

**Key Features**:
- Real-time rendering
- Error handling
- Debounced updates
- Custom styling

## Data Flow Architecture

### Content Flow

```
┌─────────────────┐
│  User Input     │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Editor  │
    └────┬────┘
         │
    ┌────▼──────────────┐
    │ onChange Handler │
    └────┬──────────────┘
         │
    ┌────▼────────┐
    │   State     │
    └────┬────────┘
         │
    ┌────▼──────────────┐
    │ LatexSerializer   │ (if mode switch)
    └────┬──────────────┘
         │
    ┌────▼──────────────┐
    │ LatexRenderer    │ (for preview)
    └────┬──────────────┘
         │
    ┌────▼────┐
    │ Preview │
    └─────────┘
```

### Mode Switching Flow

```
Source Mode (LaTeX String)
        │
        ▼
LatexSerializer.fromLatex()
        │
        ▼
Tiptap JSON Document
        │
        ▼
WysiwygEditor (displays)
        │
        ▼
User edits visually
        │
        ▼
LatexSerializer.toLatex()
        │
        ▼
LaTeX String
        │
        ▼
Source Mode (LaTeX String)
```

## Library Integration

### CodeMirror 6 Integration

**Purpose**: Source code editing

**Integration Points**:
- Custom LaTeX language definition (`latex-lang.ts`)
- Editor state management
- Change event handling
- Theme customization

**Key Code**:
```typescript
import { latex } from '../lib/latex-lang';

const state = EditorState.create({
  extensions: [basicSetup, latex()]
});
```

### Tiptap Integration

**Purpose**: WYSIWYG editing

**Integration Points**:
- Editor instance creation
- Extension configuration
- Content serialization
- Toolbar integration

**Key Code**:
```typescript
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mathematics from '@tiptap/extension-mathematics';

const editor = useEditor({
  extensions: [StarterKit, Mathematics],
  content: initialContent
});
```

### MathLive Integration

**Purpose**: Visual math editing

**Integration Points**:
- MathInputDialog component
- Math node insertion
- LaTeX generation from math input

**Key Code**:
```typescript
import { MathfieldElement } from 'mathlive';

const mathfield = new MathfieldElement();
mathfield.setValue(latex);
mathfield.addEventListener('input', () => {
  const latex = mathfield.getValue();
  onConfirm(latex);
});
```

### KaTeX Integration

**Purpose**: Math rendering

**Integration Points**:
- LatexRenderer class
- Inline and display math rendering
- Error handling

**Key Code**:
```typescript
import katex from 'katex';

// Inline math
katex.renderToString('E = mc^2', {
  throwOnError: false
});

// Display math
katex.renderToString('\\int_0^\\infty', {
  displayMode: true,
  throwOnError: false
});
```

## Serialization System

### LatexSerializer

**Purpose**: Convert between LaTeX and Tiptap JSON

**Key Methods**:
- `fromLatex(latex: string): TiptapDocument`
- `toLatex(doc: TiptapDocument): string`

**Conversion Rules**:
- Sections → Headings (H1, H2, H3)
- Lists → Bullet/Ordered lists
- Math → Math nodes
- Text formatting → Marks
- Tables → Table nodes

### LatexRenderer

**Purpose**: Convert LaTeX to HTML

**Key Methods**:
- `render(latexContent: string): string`
- `processDocument(content: string): string`
- `processMath(content: string): string`

**Processing Steps**:
1. Remove comments
2. Extract document body
3. Process sections
4. Process lists
5. Process math (inline and display)
6. Process text formatting
7. Process tables
8. Process links

## State Management

### Component State

Components use React hooks for state management:

```typescript
// Mode state
const [mode, setMode] = useState<EditorMode>('source');

// Content state
const [content, setContent] = useState(initialContent);

// Callbacks
const handleChange = useCallback((newContent: string) => {
  setContent(newContent);
  onChange?.(newContent);
}, [onChange]);
```

### Content Synchronization

Content is synchronized through:
1. Parent component manages content state
2. onChange callbacks propagate changes
3. Mode switching triggers serialization
4. Both editors receive same content

## Performance Optimizations

### Debouncing

Preview updates are debounced:

```typescript
const debouncedContent = useDebounce(content, previewDebounce);
```

### Memoization

Callbacks are memoized:

```typescript
const handleChange = useCallback((newContent: string) => {
  // ...
}, [dependencies]);
```

### Component Keys

Mode switching uses keys for remounting:

```typescript
{mode === 'source' ? (
  <LatexEditor key="source-editor" />
) : (
  <WysiwygEditor key="wysiwyg-editor" />
)}
```

## Error Handling

### Preview Errors

```typescript
try {
  const html = renderer.render(content);
} catch (error) {
  onPreviewError?.(error);
  return renderError(error);
}
```

### Serialization Errors

```typescript
try {
  const doc = serializer.fromLatex(latex);
} catch (error) {
  console.error('Serialization error:', error);
  // Fallback to empty document
}
```

## Build System

### Vite Configuration

**Library Mode**:
- Entry: `src/index.ts`
- Output: UMD and ES modules
- External: React, ReactDOM

**Demo Mode**:
- Entry: `src/demo/main.tsx`
- Output: Static site
- Includes all dependencies

### TypeScript Configuration

- Target: ES2020
- Module: ESNext
- JSX: react-jsx
- Strict mode enabled

## Testing Considerations

### Unit Testing
- Test serialization logic
- Test renderer logic
- Test utility functions

### Integration Testing
- Test component interactions
- Test mode switching
- Test content synchronization

### E2E Testing
- Test user workflows
- Test editor functionality
- Test preview rendering

For more details on specific components, see [Component Structure](./components.md).

