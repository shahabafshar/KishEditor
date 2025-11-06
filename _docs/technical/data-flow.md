# Data Flow

This document explains how data flows through KishEditor's components and systems.

## Content Flow Overview

```
User Input
    ↓
Editor Component (CodeMirror or Tiptap)
    ↓
onChange Callback
    ↓
Parent Component State
    ↓
[Optional] Mode Conversion (LatexSerializer)
    ↓
[Optional] Preview Rendering (LatexRenderer)
    ↓
[Optional] External Storage/API
```

## Detailed Flow Diagrams

### Source Mode Editing Flow

```
┌─────────────────┐
│  User Types     │
│  in Editor      │
└────────┬────────┘
         │
    ┌────▼────────────────────────┐
    │ CodeMirror onChange Event   │
    └────┬────────────────────────┘
         │
    ┌────▼────────────────────────┐
    │ LatexEditor onChange Prop   │
    └────┬────────────────────────┘
         │
    ┌────▼────────────────────────┐
    │ Parent Component State      │
    │ setContent(newContent)      │
    └────┬────────────────────────┘
         │
    ┌────▼────────────────────────┐
    │ [If Preview Enabled]       │
    │ LatexPreview Component     │
    └────┬────────────────────────┘
         │
    ┌────▼────────────────────────┐
    │ LatexRenderer.render()     │
    └────┬────────────────────────┘
         │
    ┌────▼────────────────────────┐
    │ KaTeX Rendering              │
    └────┬────────────────────────┘
         │
    ┌────▼────────────────────────┐
    │ HTML Output in Preview       │
    └─────────────────────────────┘
```

### WYSIWYG Mode Editing Flow

```
┌─────────────────┐
│  User Edits     │
│  Visually       │
└────────┬────────┘
         │
    ┌────▼────────────────────────┐
    │ Tiptap onChange Event       │
    └────┬────────────────────────┘
         │
    ┌────▼────────────────────────┐
    │ Tiptap JSON Document         │
    └────┬────────────────────────┘
         │
    ┌────▼────────────────────────┐
    │ LatexSerializer.toLatex()   │
    └────┬────────────────────────┘
         │
    ┌────▼────────────────────────┐
    │ LaTeX String                 │
    └────┬────────────────────────┘
         │
    ┌────▼────────────────────────┐
    │ WysiwygEditor onChange Prop  │
    └────┬────────────────────────┘
         │
    ┌────▼────────────────────────┐
    │ Parent Component State      │
    │ setContent(latexString)     │
    └────┬────────────────────────┘
         │
    ┌────▼────────────────────────┐
    │ [If Preview Enabled]        │
    │ LatexPreview Component      │
    └────┬────────────────────────┘
         │
    ┌────▼────────────────────────┐
    │ LatexRenderer.render()      │
    └────┬────────────────────────┘
         │
    ┌────▼────────────────────────┐
    │ HTML Output in Preview       │
    └─────────────────────────────┘
```

### Mode Switching Flow

```
┌─────────────────────────────────┐
│  User Clicks Mode Toggle        │
│  (Source → WYSIWYG)             │
└────────────┬────────────────────┘
             │
    ┌────────▼────────────────────┐
    │ DualModeEditor              │
    │ setMode('wysiwyg')          │
    └────────┬────────────────────┘
             │
    ┌────────▼────────────────────┐
    │ Current Content (LaTeX)      │
    └────────┬────────────────────┘
             │
    ┌────────▼────────────────────┐
    │ LatexSerializer.fromLatex() │
    └────────┬────────────────────┘
             │
    ┌────────▼────────────────────┐
    │ Tiptap JSON Document        │
    └────────┬────────────────────┘
             │
    ┌────────▼────────────────────┐
    │ WysiwygEditor               │
    │ editor.commands.setContent()│
    └────────┬────────────────────┘
             │
    ┌────────▼────────────────────┐
    │ Visual Content Displayed     │
    └─────────────────────────────┘
```

## State Management

### Component State Hierarchy

```
App Component (Root)
    │
    ├── content: string (LaTeX)
    │
    └── DualModeEditor
            │
            ├── mode: 'source' | 'wysiwyg'
            │
            ├── [Source Mode]
            │   └── LatexEditor
            │       └── CodeMirror State
            │           └── doc: string
            │
            └── [WYSIWYG Mode]
                └── WysiwygEditor
                    └── Tiptap Editor State
                        └── JSON Document
```

### State Updates

**Content Updates**:
1. User edits in editor
2. Editor fires onChange
3. Parent updates content state
4. Content prop flows down to editor
5. Editor syncs if content changed externally

**Mode Updates**:
1. User clicks mode toggle
2. Mode state updates
3. Component re-renders with new mode
4. Appropriate editor component mounts
5. Content converts via serializer

## Event Flow

### Change Events

```typescript
// 1. User types in CodeMirror
CodeMirror onChange
    ↓
// 2. LatexEditor receives update
onChange(update.state.doc.toString())
    ↓
// 3. Parent component updates
setContent(newContent)
    ↓
// 4. Content flows to preview (if enabled)
<LatexPreview content={content} />
    ↓
// 5. Preview renders
LatexRenderer.render(content)
```

### Error Events

```typescript
// Rendering error occurs
try {
  renderer.render(content)
} catch (error) {
    ↓
  onPreviewError?.(error)
    ↓
  Parent component handles error
    ↓
  [Optional] Show error UI
}
```

## Serialization Flow

### LaTeX → Tiptap JSON

```
LaTeX String
    ↓
LatexSerializer.fromLatex()
    ↓
Parse LaTeX Structure
    ├── Sections → Headings
    ├── Lists → List Nodes
    ├── Math → Math Nodes
    ├── Formatting → Marks
    └── Text → Text Nodes
    ↓
Tiptap JSON Document
```

### Tiptap JSON → LaTeX

```
Tiptap JSON Document
    ↓
LatexSerializer.toLatex()
    ↓
Traverse Document Tree
    ├── Headings → \section{}
    ├── Lists → \begin{itemize}
    ├── Math Nodes → $...$ or $$...$$
    ├── Marks → \textbf{}, \textit{}
    └── Text → Plain Text
    ↓
LaTeX String
```

## Rendering Flow

### LaTeX → HTML

```
LaTeX String
    ↓
LatexRenderer.render()
    ↓
Process Document
    ├── Remove Comments
    ├── Extract Document Body
    ├── Process Sections
    ├── Process Lists
    ├── Process Math (KaTeX)
    ├── Process Formatting
    ├── Process Tables
    └── Process Links
    ↓
HTML String
    ↓
Insert into DOM
```

### Math Rendering

```
Math Content ($...$ or $$...$$)
    ↓
Extract Math Expression
    ↓
Determine Mode (inline/display)
    ↓
KaTeX.renderToString()
    ├── Parse LaTeX Math
    ├── Generate MathML/HTML
    └── Apply Styling
    ↓
HTML String
    ↓
Insert into Preview
```

## Performance Optimizations

### Debouncing Flow

```
User Types Rapidly
    ↓
onChange Fires (every keystroke)
    ↓
Content State Updates
    ↓
useDebounce Hook
    ├── Wait for delay (500ms default)
    └── If no new changes, update debounced value
    ↓
Debounced Content
    ↓
Preview Renders (only once after typing stops)
```

### Memoization Flow

```
Component Renders
    ↓
useCallback/useMemo Check Dependencies
    ├── Dependencies Changed? → Recompute
    └── Dependencies Same? → Return Cached Value
    ↓
Optimized Re-renders
```

## External Integration Flow

### Save to Backend

```
User Edits
    ↓
Content Updates
    ↓
[Optional] Debounce Save
    ↓
onChange Callback
    ↓
Parent Component
    ↓
Save Function
    ├── POST /api/save
    └── { content: latexString }
    ↓
Backend Storage
```

### Load from Backend

```
Component Mounts
    ↓
Fetch Content
    ├── GET /api/document/:id
    └── Receive LaTeX String
    ↓
Set initialContent Prop
    ↓
Editor Loads Content
    ↓
[If WYSIWYG Mode]
    ↓
Convert via Serializer
    ↓
Display in Editor
```

## Error Handling Flow

### Rendering Error

```
Invalid LaTeX Content
    ↓
LatexRenderer.render()
    ↓
Error Occurs
    ↓
Catch Block
    ├── throwOnError: true → Throw Error
    └── throwOnError: false → Return Error HTML
    ↓
onPreviewError Callback
    ↓
Parent Component Handles
    ├── Log Error
    ├── Show Error UI
    └── [Optional] Fallback Content
```

### Serialization Error

```
Invalid LaTeX Structure
    ↓
LatexSerializer.fromLatex()
    ↓
Parse Error
    ↓
Catch Block
    ├── Log Error
    └── Return Empty Document
    ↓
Editor Shows Empty State
```

For implementation details, see [Technical Architecture](./architecture.md).

