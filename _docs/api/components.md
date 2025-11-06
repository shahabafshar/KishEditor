# Components API

Complete API reference for all React components in KishEditor.

## DualModeEditor

Main component that provides both source and WYSIWYG editing modes with seamless switching.

### Props

```typescript
interface DualModeEditorProps {
  /**
   * Initial LaTeX content
   * @default ''
   */
  initialContent?: string;

  /**
   * Callback when content changes
   * Receives the LaTeX string representation
   */
  onChange?: (content: string) => void;

  /**
   * Height of the component
   * @default '600px'
   */
  height?: string;

  /**
   * Custom CSS class name
   * @default ''
   */
  className?: string;

  /**
   * Initial editor mode
   * @default 'source'
   */
  initialMode?: 'source' | 'wysiwyg';

  /**
   * Callback when mode changes
   */
  onModeChange?: (mode: 'source' | 'wysiwyg') => void;

  /**
   * Show preview panel
   * @default true
   */
  showPreview?: boolean;

  /**
   * Preview debounce delay in milliseconds
   * @default 500
   */
  previewDebounce?: number;
}
```

### Example

```tsx
import { DualModeEditor } from 'kish-editor';

function App() {
  const [content, setContent] = useState('\\section{Hello}');

  return (
    <DualModeEditor
      initialContent={content}
      onChange={setContent}
      height="800px"
      initialMode="wysiwyg"
      showPreview={true}
      previewDebounce={300}
      onModeChange={(mode) => console.log('Mode:', mode)}
    />
  );
}
```

## LatexEditor

Source code editor for LaTeX using CodeMirror 6.

### Props

```typescript
interface LatexEditorProps {
  /**
   * Initial LaTeX content
   * @default ''
   */
  initialContent?: string;

  /**
   * Callback when content changes
   */
  onChange?: (content: string) => void;

  /**
   * Height of the editor
   * @default '600px'
   */
  height?: string;

  /**
   * Custom CSS class name
   * @default ''
   */
  className?: string;

  /**
   * Read-only mode
   * @default false
   */
  readOnly?: boolean;
}
```

### Example

```tsx
import { LatexEditor } from 'kish-editor';

function App() {
  return (
    <LatexEditor
      initialContent="\\section{Hello World}"
      onChange={(content) => console.log(content)}
      height="400px"
      readOnly={false}
    />
  );
}
```

## WysiwygEditor

Visual WYSIWYG editor for LaTeX documents using Tiptap.

### Props

```typescript
interface WysiwygEditorProps {
  /**
   * Initial content (LaTeX or HTML)
   * @default ''
   */
  initialContent?: string;

  /**
   * Callback when content changes
   * Receives the LaTeX string representation
   */
  onChange?: (content: string) => void;

  /**
   * Height of the editor
   * @default '600px'
   */
  height?: string;

  /**
   * Custom CSS class name
   * @default ''
   */
  className?: string;

  /**
   * Read-only mode
   * @default false
   */
  readOnly?: boolean;

  /**
   * Callback for math insertion
   */
  onMathInsert?: (latex: string, isDisplay: boolean) => void;
}
```

### Example

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

## LatexPreview

Preview component that renders LaTeX content as HTML.

### Props

```typescript
interface LatexPreviewProps {
  /**
   * LaTeX content to render
   * Required
   */
  content: string;

  /**
   * Height of the preview
   * @default '600px'
   */
  height?: string;

  /**
   * Custom CSS class name
   * @default ''
   */
  className?: string;

  /**
   * Callback for rendering errors
   */
  onError?: (error: Error) => void;
}
```

### Example

```tsx
import { LatexPreview } from 'kish-editor';

function App() {
  const content = '\\section{Hello} $E = mc^2$';

  return (
    <LatexPreview
      content={content}
      height="600px"
      onError={(error) => console.error(error)}
    />
  );
}
```

## LatexEditorWithPreview

Combined editor and preview in a split-pane layout.

### Props

```typescript
interface LatexEditorWithPreviewProps {
  /**
   * Initial LaTeX content
   * @default ''
   */
  initialContent?: string;

  /**
   * Callback when content changes
   */
  onChange?: (content: string) => void;

  /**
   * Height of the entire component
   * @default '600px'
   */
  height?: string;

  /**
   * Custom CSS class name
   * @default ''
   */
  className?: string;

  /**
   * Show/hide preview panel
   * @default true
   */
  showPreview?: boolean;

  /**
   * Callback for preview rendering errors
   */
  onPreviewError?: (error: Error) => void;

  /**
   * Debounce delay for preview updates (ms)
   * @default 500
   */
  previewDebounce?: number;
}
```

### Example

```tsx
import { LatexEditorWithPreview } from 'kish-editor';

function App() {
  const [content, setContent] = useState('');

  return (
    <LatexEditorWithPreview
      initialContent={content}
      onChange={setContent}
      height="800px"
      showPreview={true}
      previewDebounce={300}
      onPreviewError={(error) => {
        console.error('Preview error:', error);
      }}
    />
  );
}
```

## MathInputDialog

Modal dialog for visual math equation editing.

### Props

```typescript
interface MathInputDialogProps {
  /**
   * Whether the dialog is open
   * Required
   */
  isOpen: boolean;

  /**
   * Callback when dialog closes
   * Required
   */
  onClose: () => void;

  /**
   * Initial LaTeX math content
   * @default ''
   */
  initialLatex?: string;

  /**
   * Display mode (block math)
   * @default false
   */
  displayMode?: boolean;

  /**
   * Callback when math is confirmed
   * Receives the LaTeX string
   * Required
   */
  onConfirm: (latex: string) => void;
}
```

### Example

```tsx
import { MathInputDialog } from 'kish-editor';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MathInputDialog
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      initialLatex="E = mc^2"
      displayMode={false}
      onConfirm={(latex) => {
        console.log('Math inserted:', latex);
        setIsOpen(false);
      }}
    />
  );
}
```

## WysiwygToolbar

Formatting toolbar for the WYSIWYG editor (internal component, but can be used directly).

### Props

```typescript
interface WysiwygToolbarProps {
  /**
   * Tiptap editor instance
   * Required
   */
  editor: Editor | null;
}
```

### Example

```tsx
import { WysiwygToolbar } from 'kish-editor';
import { useEditor } from '@tiptap/react';

function CustomEditor() {
  const editor = useEditor({
    extensions: [StarterKit]
  });

  return (
    <div>
      <WysiwygToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
```

## Common Patterns

### Controlled Component

```tsx
const [content, setContent] = useState('');

<DualModeEditor
  initialContent={content}
  onChange={setContent}
/>
```

### Uncontrolled Component

```tsx
<DualModeEditor
  initialContent="\\section{Hello}"
  onChange={(content) => {
    // Handle changes
  }}
/>
```

### Error Handling

```tsx
<LatexEditorWithPreview
  onPreviewError={(error) => {
    // Show error notification
    toast.error('Preview rendering failed');
  }}
/>
```

### Custom Styling

```tsx
<DualModeEditor
  className="my-custom-editor"
  height="100vh"
/>
```

```css
.my-custom-editor {
  border: 2px solid #ccc;
  border-radius: 8px;
}
```

For TypeScript type definitions, see [Types Reference](./types.md).

