# Component Structure

This document details the structure and responsibilities of each component in KishEditor.

## Component Overview

### Public Components

These are the components exported from the main package:

1. **DualModeEditor** - Main component with mode switching
2. **LatexEditor** - Source code editor
3. **WysiwygEditor** - Visual editor
4. **LatexPreview** - Preview component
5. **LatexEditorWithPreview** - Combined editor and preview
6. **MathInputDialog** - Math equation editor dialog

### Internal Components

These are used internally but may be useful for customization:

1. **WysiwygToolbar** - Formatting toolbar

## Component Details

### DualModeEditor

**File**: `src/components/DualModeEditor.tsx`

**Purpose**: Provides a unified interface for switching between source and WYSIWYG editing modes.

**Props**:
- `initialContent?: string` - Initial LaTeX content
- `onChange?: (content: string) => void` - Content change handler
- `height?: string` - Component height
- `className?: string` - Custom CSS class
- `initialMode?: 'source' | 'wysiwyg'` - Initial editing mode
- `onModeChange?: (mode: EditorMode) => void` - Mode change handler
- `showPreview?: boolean` - Show preview panel
- `previewDebounce?: number` - Preview update debounce delay

**Key Features**:
- Mode switching UI
- Content synchronization
- Optional preview panel
- Split-pane layout

**Dependencies**:
- LatexEditor
- WysiwygEditor
- LatexPreview
- LatexSerializer (for conversion)

### LatexEditor

**File**: `src/components/LatexEditor.tsx`

**Purpose**: Source code editor for LaTeX using CodeMirror 6.

**Props**:
- `initialContent?: string` - Initial LaTeX content
- `onChange?: (content: string) => void` - Content change handler
- `height?: string` - Editor height
- `className?: string` - Custom CSS class
- `readOnly?: boolean` - Read-only mode

**Key Features**:
- LaTeX syntax highlighting
- Line numbers
- Code editing features
- Change tracking

**Dependencies**:
- CodeMirror 6
- Custom LaTeX language (`latex-lang.ts`)

**Implementation Notes**:
- Uses `useRef` to manage CodeMirror instance
- Updates content via `useEffect` when `initialContent` changes
- Destroys editor on unmount

### WysiwygEditor

**File**: `src/components/WysiwygEditor.tsx`

**Purpose**: Visual editor for LaTeX documents using Tiptap.

**Props**:
- `initialContent?: string` - Initial LaTeX content
- `onChange?: (content: string) => void` - Content change handler
- `height?: string` - Editor height
- `className?: string` - Custom CSS class
- `readOnly?: boolean` - Read-only mode
- `onMathInsert?: (latex: string, isDisplay: boolean) => void` - Math insert handler

**Key Features**:
- Rich text formatting
- Toolbar integration
- Math node support
- LaTeX serialization

**Dependencies**:
- Tiptap React
- Tiptap extensions
- LatexSerializer
- WysiwygToolbar

**Implementation Notes**:
- Uses `useEditor` hook from Tiptap
- Converts LaTeX to Tiptap JSON on mount
- Converts Tiptap JSON to LaTeX on change
- Manages math insertion dialog

### LatexPreview

**File**: `src/components/LatexPreview.tsx`

**Purpose**: Renders LaTeX content as HTML preview.

**Props**:
- `content: string` - LaTeX content to render
- `height?: string` - Preview height
- `className?: string` - Custom CSS class
- `onError?: (error: Error) => void` - Error handler

**Key Features**:
- Real-time rendering
- Error handling
- Customizable styling
- Scrollable content

**Dependencies**:
- LatexRenderer
- KaTeX

**Implementation Notes**:
- Uses `useEffect` to render on content change
- Handles rendering errors gracefully
- Updates DOM directly for performance

### LatexEditorWithPreview

**File**: `src/components/LatexEditorWithPreview.tsx`

**Purpose**: Combined editor and preview in split-pane layout.

**Props**:
- `initialContent?: string` - Initial LaTeX content
- `onChange?: (content: string) => void` - Content change handler
- `height?: string` - Component height
- `className?: string` - Custom CSS class
- `showPreview?: boolean` - Show preview panel
- `onPreviewError?: (error: Error) => void` - Preview error handler
- `previewDebounce?: number` - Preview update debounce delay

**Key Features**:
- Split-pane layout
- Debounced preview updates
- Error handling
- Resizable panes (via CSS)

**Dependencies**:
- LatexEditor
- LatexPreview
- useDebounce hook

### MathInputDialog

**File**: `src/components/MathInputDialog.tsx`

**Purpose**: Modal dialog for visual math equation editing.

**Props**:
- `isOpen: boolean` - Dialog open state
- `onClose: () => void` - Close handler
- `initialLatex?: string` - Initial LaTeX math
- `displayMode?: boolean` - Display math mode
- `onConfirm: (latex: string) => void` - Confirm handler

**Key Features**:
- MathLive integration
- Visual math input
- Live preview
- Keyboard shortcuts

**Dependencies**:
- MathLive
- KaTeX (for preview)

**Implementation Notes**:
- Uses MathLive's MathfieldElement
- Handles inline and display math modes
- Provides Enter/Escape keyboard shortcuts

### WysiwygToolbar

**File**: `src/components/toolbar/WysiwygToolbar.tsx`

**Purpose**: Formatting toolbar for WYSIWYG editor.

**Props**:
- `editor: Editor | null` - Tiptap editor instance

**Key Features**:
- Text formatting buttons
- Heading buttons
- List buttons
- Math insertion buttons
- Undo/redo buttons

**Buttons**:
- **Bold** (`\textbf{}`)
- **Italic** (`\textit{}`)
- **Underline** (`\underline{}`)
- **Code** (`\texttt{}`)
- **H1** (`\section{}`)
- **H2** (`\subsection{}`)
- **H3** (`\subsubsection{}`)
- **Bullet List** (`itemize`)
- **Numbered List** (`enumerate`)
- **Inline Math** (`$...$`)
- **Display Math** (`$$...$$`)
- **Undo**
- **Redo**

**Dependencies**:
- Tiptap editor instance

## Component Relationships

```
DualModeEditor
├── Uses LatexEditor (source mode)
├── Uses WysiwygEditor (wysiwyg mode)
└── Uses LatexPreview (optional)

WysiwygEditor
├── Uses WysiwygToolbar
├── Uses MathInputDialog (for math insertion)
└── Uses LatexSerializer (for conversion)

LatexEditorWithPreview
├── Uses LatexEditor
└── Uses LatexPreview
```

## Component Lifecycle

### Mounting

1. Component receives `initialContent` prop
2. Editor instance is created (CodeMirror or Tiptap)
3. Content is loaded into editor
4. Event listeners are attached

### Updating

1. Content changes trigger `onChange` callback
2. Parent component updates state
3. Preview updates (if applicable)
4. Editor content syncs if `initialContent` prop changes

### Unmounting

1. Editor instance is destroyed
2. Event listeners are removed
3. Cleanup functions run

## Customization Points

### Styling

All components accept `className` prop for custom styling:

```tsx
<DualModeEditor className="my-custom-editor" />
```

### Behavior

Components can be extended by wrapping:

```tsx
function CustomEditor(props) {
  return (
    <DualModeEditor
      {...props}
      onChange={(content) => {
        // Custom logic
        props.onChange?.(content);
      }}
    />
  );
}
```

### Content Processing

Intercept content changes:

```tsx
<DualModeEditor
  onChange={(content) => {
    const processed = processContent(content);
    onSave(processed);
  }}
/>
```

For API details, see [Components API](../api/components.md).

