# Types Reference

Complete TypeScript type definitions for KishEditor.

## Component Props Types

### DualModeEditorProps

```typescript
interface DualModeEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  height?: string;
  className?: string;
  initialMode?: EditorMode;
  onModeChange?: (mode: EditorMode) => void;
  showPreview?: boolean;
  previewDebounce?: number;
}
```

### LatexEditorProps

```typescript
interface LatexEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  height?: string;
  className?: string;
  readOnly?: boolean;
}
```

### WysiwygEditorProps

```typescript
interface WysiwygEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  height?: string;
  className?: string;
  readOnly?: boolean;
  onMathInsert?: (latex: string, isDisplay: boolean) => void;
}
```

### LatexPreviewProps

```typescript
interface LatexPreviewProps {
  content: string;
  height?: string;
  className?: string;
  onError?: (error: Error) => void;
}
```

### LatexEditorWithPreviewProps

```typescript
interface LatexEditorWithPreviewProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  height?: string;
  className?: string;
  showPreview?: boolean;
  onPreviewError?: (error: Error) => void;
  previewDebounce?: number;
}
```

### MathInputDialogProps

```typescript
interface MathInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialLatex?: string;
  displayMode?: boolean;
  onConfirm: (latex: string) => void;
}
```

## Utility Types

### EditorMode

```typescript
type EditorMode = 'source' | 'wysiwyg';
```

### LatexRenderOptions

```typescript
interface LatexRenderOptions {
  strict?: boolean;
  macros?: Record<string, string>;
  throwOnError?: boolean;
}
```

## Serialization Types

### TiptapDocument

```typescript
interface TiptapDocument {
  type: 'doc';
  content: TiptapNode[];
}
```

### TiptapNode

```typescript
interface TiptapNode {
  type: string;
  attrs?: Record<string, any>;
  content?: TiptapNode[];
  text?: string;
  marks?: Array<{
    type: string;
    attrs?: Record<string, any>;
  }>;
}
```

## Usage Examples

### Type-Safe Component Props

```typescript
import type { DualModeEditorProps } from 'kish-editor';

const props: DualModeEditorProps = {
  initialContent: '\\section{Hello}',
  onChange: (content: string) => {
    console.log(content);
  },
  height: '600px',
  initialMode: 'wysiwyg'
};
```

### Type-Safe Renderer Options

```typescript
import type { LatexRenderOptions } from 'kish-editor';

const options: LatexRenderOptions = {
  strict: false,
  macros: {
    '\\RR': '\\mathbb{R}'
  },
  throwOnError: false
};
```

### Type-Safe Mode Handling

```typescript
import type { EditorMode } from 'kish-editor';

function handleModeChange(mode: EditorMode) {
  if (mode === 'source') {
    // Handle source mode
  } else if (mode === 'wysiwyg') {
    // Handle WYSIWYG mode
  }
}
```

### Type-Safe Serialization

```typescript
import type { TiptapDocument, TiptapNode } from 'kish-editor';

function processDocument(doc: TiptapDocument) {
  doc.content.forEach((node: TiptapNode) => {
    console.log('Node type:', node.type);
  });
}
```

## Type Guards

### Checking Editor Mode

```typescript
import type { EditorMode } from 'kish-editor';

function isSourceMode(mode: EditorMode): mode is 'source' {
  return mode === 'source';
}

function isWysiwygMode(mode: EditorMode): mode is 'wysiwyg' {
  return mode === 'wysiwyg';
}
```

## Generic Types

### useDebounce Generic

```typescript
function useDebounce<T>(value: T, delay: number): T;
```

**Usage**:
```typescript
const debouncedString = useDebounce<string>('hello', 500);
const debouncedNumber = useDebounce<number>(42, 500);
```

## Exported Types

All types are exported from the main package:

```typescript
import type {
  DualModeEditorProps,
  LatexEditorProps,
  WysiwygEditorProps,
  LatexPreviewProps,
  LatexEditorWithPreviewProps,
  MathInputDialogProps,
  EditorMode,
  LatexRenderOptions,
  TiptapDocument,
  TiptapNode
} from 'kish-editor';
```

## Type Inference

TypeScript can infer types in many cases:

```typescript
import { DualModeEditor } from 'kish-editor';

// TypeScript infers the prop types
<DualModeEditor
  initialContent="hello"
  onChange={(content) => {
    // content is inferred as string
    console.log(content);
  }}
  initialMode="wysiwyg" // inferred as EditorMode
/>
```

## Type Narrowing

```typescript
import type { EditorMode } from 'kish-editor';

function handleMode(mode: EditorMode) {
  if (mode === 'source') {
    // TypeScript knows mode is 'source' here
    console.log('Source mode');
  } else {
    // TypeScript knows mode is 'wysiwyg' here
    console.log('WYSIWYG mode');
  }
}
```

## Common Type Patterns

### Event Handlers

```typescript
// Content change handler
type ContentChangeHandler = (content: string) => void;

// Mode change handler
type ModeChangeHandler = (mode: EditorMode) => void;

// Error handler
type ErrorHandler = (error: Error) => void;
```

### Component Refs

```typescript
import { useRef } from 'react';
import type { DualModeEditorProps } from 'kish-editor';

const editorRef = useRef<DualModeEditorProps>(null);
```

For component API details, see [Components API](./components.md).

