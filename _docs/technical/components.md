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

### UnifiedToolbar

**File**: `src/components/toolbar/UnifiedToolbar.tsx`

**Purpose**: Unified ribbon-style toolbar that works with both source and WYSIWYG editing modes.

**Props**:
- `editor: EditorInstance` - Tiptap Editor or CodeMirror EditorView instance
- `mode: 'source' | 'wysiwyg'` - Current editing mode
- `onMathInsert?: (displayMode: boolean) => void` - Math insertion callback
- `hasFocus?: boolean` - Whether the editor currently has focus

**Key Features**:
- Ribbon interface with tabs (Home, Insert)
- Grouped buttons by functionality
- Color-coded sections for visual organization
- Works with both CodeMirror (source) and Tiptap (WYSIWYG) editors
- Adapts button behavior based on editor mode
- Table insertion with automatic table exit handling

**Ribbon Structure**:
- **Home Tab**:
  - Text Group: Bold, Italic, Underline, Code, Highlight, Strikethrough
  - Headings Group: H1, H2, H3, Paragraph
  - Lists Group: Bullet List, Numbered List, Blockquote
  - History Group: Undo, Redo
- **Insert Tab**:
  - Elements Group: Table, Link, Remove Link
  - Math Group: Inline Math, Display Math

**Table Insertion**:
- Automatically detects if cursor is inside a table
- Exits table before inserting new table if needed
- Uses `can().insertTable()` to check command availability
- Supports unlimited table insertions per document

**Dependencies**:
- Tiptap Editor (for WYSIWYG mode)
- CodeMirror EditorView (for source mode)

### WysiwygToolbar (Deprecated)

**File**: `src/components/toolbar/WysiwygToolbar.tsx`

**Status**: ⚠️ Deprecated - Replaced by UnifiedToolbar

**Note**: This component is kept for backward compatibility but UnifiedToolbar should be used for new implementations.

## Component Relationships

```
DualModeEditor
├── Uses LatexEditor (source mode)
├── Uses WysiwygEditor (wysiwyg mode)
└── Uses LatexPreview (optional)

WysiwygEditor
├── Uses UnifiedToolbar (via DualModeEditor)
├── Uses MathInputDialog (for math insertion)
└── Uses LatexSerializer (for conversion)

DualModeEditor
├── Uses UnifiedToolbar (shared toolbar for both modes)
├── Uses LatexEditor (source mode)
├── Uses WysiwygEditor (wysiwyg mode)
└── Uses LatexPreview (optional)

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

