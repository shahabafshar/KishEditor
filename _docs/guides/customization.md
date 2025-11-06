# Customization Guide

Learn how to customize KishEditor's appearance and behavior.

## Styling

### CSS Classes

KishEditor uses the following CSS classes that you can override:

#### DualModeEditor
- `.dual-mode-editor` - Main container
- `.mode-switcher` - Mode toggle container
- `.mode-buttons` - Mode button container
- `.mode-button` - Individual mode button
- `.mode-button.active` - Active mode button
- `.dual-mode-content` - Editor content area
- `.dual-mode-split-view` - Split-pane layout
- `.dual-mode-pane` - Individual pane
- `.editor-pane` - Editor pane
- `.preview-pane` - Preview pane

#### LatexEditor
- `.latex-editor-container` - Editor container
- `.cm-editor` - CodeMirror editor

#### WysiwygEditor
- `.wysiwyg-editor` - WYSIWYG editor container
- `.wysiwyg-toolbar` - Toolbar container

#### LatexPreview
- `.latex-preview` - Preview container
- `.latex-preview-content` - Preview content

### Custom CSS

```css
/* Override default styles */
.dual-mode-editor {
  border: 2px solid #ccc;
  border-radius: 8px;
}

.mode-button {
  background-color: #007bff;
  color: white;
}

.mode-button.active {
  background-color: #0056b3;
}

.latex-preview {
  background-color: #f8f9fa;
  padding: 20px;
}
```

### CSS Modules

```tsx
// Editor.module.css
.editor {
  border: 2px solid #ccc;
  border-radius: 8px;
}

.toolbar {
  background-color: #f0f0f0;
  padding: 10px;
}

// Editor.tsx
import styles from './Editor.module.css';
import { DualModeEditor } from 'kish-editor';

function Editor() {
  return (
    <DualModeEditor
      className={styles.editor}
    />
  );
}
```

### Styled Components

```tsx
import styled from 'styled-components';
import { DualModeEditor } from 'kish-editor';

const StyledEditor = styled.div`
  .dual-mode-editor {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .mode-button {
    transition: all 0.2s;
    
    &:hover {
      background-color: #f0f0f0;
    }
    
    &.active {
      background-color: #007bff;
      color: white;
    }
  }
`;

function Editor() {
  return (
    <StyledEditor>
      <DualModeEditor />
    </StyledEditor>
  );
}
```

## Theming

### Dark Mode

```css
.dark-theme .dual-mode-editor {
  background-color: #1e1e1e;
  color: #d4d4d4;
}

.dark-theme .latex-editor-container {
  background-color: #1e1e1e;
}

.dark-theme .latex-preview {
  background-color: #252526;
  color: #d4d4d4;
}

.dark-theme .mode-button {
  background-color: #3c3c3c;
  color: #d4d4d4;
}

.dark-theme .mode-button.active {
  background-color: #007acc;
}
```

### Custom Color Scheme

```css
:root {
  --editor-primary: #007bff;
  --editor-secondary: #6c757d;
  --editor-background: #ffffff;
  --editor-text: #212529;
}

.custom-theme .dual-mode-editor {
  background-color: var(--editor-background);
  color: var(--editor-text);
}

.custom-theme .mode-button.active {
  background-color: var(--editor-primary);
}
```

## Behavior Customization

### Custom Debounce Delay

```tsx
<DualModeEditor
  previewDebounce={1000} // 1 second delay
/>
```

### Custom Error Handling

```tsx
<DualModeEditor
  onPreviewError={(error) => {
    // Custom error handling
    console.error('Preview error:', error);
    showNotification('Failed to render preview');
  }}
/>
```

### Custom Mode Change Handler

```tsx
<DualModeEditor
  onModeChange={(mode) => {
    console.log('Mode changed to:', mode);
    // Track analytics, save preference, etc.
    analytics.track('editor_mode_change', { mode });
  }}
/>
```

## Extending Components

### Wrapper Component

```tsx
import { DualModeEditor } from 'kish-editor';
import type { DualModeEditorProps } from 'kish-editor';

interface CustomEditorProps extends DualModeEditorProps {
  onSave?: () => void;
  showSaveButton?: boolean;
}

function CustomEditor({ onSave, showSaveButton, ...props }: CustomEditorProps) {
  return (
    <div>
      {showSaveButton && (
        <button onClick={onSave}>Save</button>
      )}
      <DualModeEditor {...props} />
    </div>
  );
}
```

### Custom Toolbar

```tsx
import { WysiwygEditor } from 'kish-editor';
import { useEditor } from '@tiptap/react';

function EditorWithCustomToolbar() {
  const editor = useEditor({
    extensions: [StarterKit]
  });

  return (
    <div>
      {/* Custom toolbar */}
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <button onClick={() => editor?.chain().focus().toggleBold().run()}>
          Bold
        </button>
        {/* More custom buttons */}
      </div>
      
      <WysiwygEditor
        initialContent="\\section{Hello}"
        height="600px"
      />
    </div>
  );
}
```

## Advanced Customization

### Custom Renderer Options

```tsx
import { LatexRenderer } from 'kish-editor';

const customRenderer = new LatexRenderer({
  macros: {
    '\\RR': '\\mathbb{R}',
    '\\NN': '\\mathbb{N}'
  },
  throwOnError: false
});

// Use custom renderer in preview
```

### Custom Serializer

```tsx
import { LatexSerializer } from 'kish-editor';

class CustomSerializer extends LatexSerializer {
  fromLatex(latex: string) {
    // Custom parsing logic
    const doc = super.fromLatex(latex);
    // Modify document
    return doc;
  }

  toLatex(doc: TiptapDocument) {
    // Custom serialization logic
    const latex = super.toLatex(doc);
    // Modify LaTeX
    return latex;
  }
}
```

### Custom CodeMirror Extensions

```tsx
import { LatexEditor } from 'kish-editor';
import { EditorView } from '@codemirror/view';

// Note: This requires direct CodeMirror access
// You may need to extend LatexEditor component
```

## Responsive Design

### Mobile-Friendly Layout

```css
@media (max-width: 768px) {
  .dual-mode-split-view {
    flex-direction: column;
  }

  .dual-mode-pane {
    width: 100% !important;
    height: 50vh !important;
  }

  .mode-buttons {
    flex-direction: column;
  }
}
```

### Full-Screen Mode

```tsx
function FullScreenEditor() {
  return (
    <DualModeEditor
      height="100vh"
      className="fullscreen-editor"
    />
  );
}
```

```css
.fullscreen-editor {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}
```

## Accessibility

### Keyboard Navigation

KishEditor supports standard keyboard navigation. You can enhance it:

```css
.mode-button:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}
```

### Screen Reader Support

```tsx
<DualModeEditor
  aria-label="LaTeX Document Editor"
  className="accessible-editor"
/>
```

## Performance Optimization

### Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

const DualModeEditor = lazy(
  () => import('kish-editor').then(mod => ({ default: mod.DualModeEditor }))
);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DualModeEditor />
    </Suspense>
  );
}
```

### Memoization

```tsx
import { memo } from 'react';

const MemoizedEditor = memo(DualModeEditor);
```

For more examples, see [Usage Examples](./usage-examples.md).

