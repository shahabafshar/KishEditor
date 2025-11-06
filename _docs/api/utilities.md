# Utilities API

Reference for utility classes and functions in KishEditor.

## LatexRenderer

Class for rendering LaTeX content to HTML.

### Constructor

```typescript
class LatexRenderer {
  constructor(options?: LatexRenderOptions);
}
```

### Options

```typescript
interface LatexRenderOptions {
  /**
   * Whether to use strict mode for parsing
   * @default false
   */
  strict?: boolean;

  /**
   * Custom macro definitions
   * @default {}
   */
  macros?: Record<string, string>;

  /**
   * Error handling mode
   * @default false
   */
  throwOnError?: boolean;
}
```

### Methods

#### render

Renders LaTeX content to HTML string.

```typescript
render(latexContent: string): string
```

**Parameters**:
- `latexContent` (string): LaTeX content to render

**Returns**: HTML string

**Example**:
```typescript
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

### Usage Example

```typescript
import { LatexRenderer } from 'kish-editor';

// Create renderer with custom options
const renderer = new LatexRenderer({
  macros: {
    '\\RR': '\\mathbb{R}',
    '\\NN': '\\mathbb{N}'
  },
  throwOnError: false
});

// Render LaTeX
const html = renderer.render(`
\\documentclass{article}
\\begin{document}
\\section{Hello}
$E = mc^2$
\\end{document}
`);

// Use HTML
document.getElementById('preview').innerHTML = html;
```

## LatexSerializer

Class for converting between LaTeX and Tiptap JSON.

### Constructor

```typescript
class LatexSerializer {
  constructor();
}
```

### Methods

#### fromLatex

Converts LaTeX string to Tiptap JSON document.

```typescript
fromLatex(latexContent: string): TiptapDocument
```

**Parameters**:
- `latexContent` (string): LaTeX content

**Returns**: TiptapDocument (JSON structure)

**Example**:
```typescript
import { LatexSerializer } from 'kish-editor';

const serializer = new LatexSerializer();
const doc = serializer.fromLatex('\\section{Hello}');
```

#### toLatex

Converts Tiptap JSON document to LaTeX string.

```typescript
toLatex(doc: TiptapDocument): string
```

**Parameters**:
- `doc` (TiptapDocument): Tiptap JSON document

**Returns**: LaTeX string

**Example**:
```typescript
import { LatexSerializer } from 'kish-editor';

const serializer = new LatexSerializer();
const latex = serializer.toLatex(tiptapDoc);
```

### Usage Example

```typescript
import { LatexSerializer } from 'kish-editor';

const serializer = new LatexSerializer();

// Convert LaTeX to Tiptap JSON
const latex = '\\section{Hello}\\subsection{World}';
const doc = serializer.fromLatex(latex);

// Convert Tiptap JSON to LaTeX
const latexAgain = serializer.toLatex(doc);
console.log(latexAgain); // '\\section{Hello}\\subsection{World}'
```

## latexSerializer

Pre-configured singleton instance of LatexSerializer.

```typescript
export const latexSerializer: LatexSerializer;
```

**Usage**:
```typescript
import { latexSerializer } from 'kish-editor';

const doc = latexSerializer.fromLatex('\\section{Hello}');
const latex = latexSerializer.toLatex(doc);
```

## Custom Hooks

### useDebounce

Custom hook for debouncing values.

```typescript
function useDebounce<T>(value: T, delay: number): T
```

**Parameters**:
- `value` (T): Value to debounce
- `delay` (number): Delay in milliseconds

**Returns**: Debounced value

**Example**:
```typescript
import { useDebounce } from 'kish-editor';

function Component() {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 500);

  useEffect(() => {
    // This runs 500ms after user stops typing
    console.log('Debounced:', debouncedInput);
  }, [debouncedInput]);

  return <input value={input} onChange={(e) => setInput(e.target.value)} />;
}
```

### useEditorContent

Custom hook for managing editor content with onChange callback.

```typescript
function useEditorContent(
  initialContent?: string,
  onChange?: (content: string) => void
): [string, (content: string) => void]
```

**Parameters**:
- `initialContent` (string, optional): Initial content
- `onChange` (function, optional): Change callback

**Returns**: Tuple of `[content, setContent]`

**Example**:
```typescript
import { useEditorContent } from 'kish-editor';

function Component() {
  const [content, setContent] = useEditorContent('', (newContent) => {
    console.log('Content changed:', newContent);
  });

  return <div>{content}</div>;
}
```

## Type Definitions

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

## Advanced Usage

### Custom Macros

```typescript
const renderer = new LatexRenderer({
  macros: {
    '\\RR': '\\mathbb{R}',
    '\\NN': '\\mathbb{N}',
    '\\QQ': '\\mathbb{Q}',
    '\\ZZ': '\\mathbb{Z}',
    '\\CC': '\\mathbb{C}'
  }
});

const html = renderer.render('$x \\in \\RR$');
```

### Error Handling

```typescript
const renderer = new LatexRenderer({
  throwOnError: false // Don't throw, return error HTML
});

try {
  const html = renderer.render(invalidLatex);
  // html contains error message HTML
} catch (error) {
  // Only thrown if throwOnError: true
  console.error(error);
}
```

### Serialization Customization

The serializer handles:
- Sections → Headings
- Lists → List nodes
- Math → Math nodes
- Formatting → Marks
- Tables → Table nodes
- Links → Link nodes

You can extend the serializer for custom conversions:

```typescript
class CustomSerializer extends LatexSerializer {
  fromLatex(latex: string): TiptapDocument {
    const doc = super.fromLatex(latex);
    // Custom processing
    return doc;
  }

  toLatex(doc: TiptapDocument): string {
    // Custom processing
    return super.toLatex(doc);
  }
}
```

For more details on types, see [Types Reference](./types.md).

