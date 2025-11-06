# Architecture Overview

This document provides a high-level overview of KishEditor's architecture.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React App  │  │  Components  │  │    Demo     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Component Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ DualModeEdit │  │ LatexEditor  │  │ WysiwygEdit  │      │
│  │     or       │  │              │  │     or       │      │
│  │ LatexEditor │  │ LatexPreview │  │ MathInput    │      │
│  │ WithPreview  │  │              │  │   Dialog     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                       Library Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  CodeMirror  │  │    Tiptap    │  │   MathLive   │      │
│  │      6       │  │ (ProseMirror)│  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │    KaTeX     │  │  LaTeX.js   │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Utility Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │LatexRenderer │  │LatexSerializer│ │   Hooks     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
DualModeEditor
├── Mode Switcher (Source/WYSIWYG toggle)
├── Editor Pane
│   ├── LatexEditor (Source Mode)
│   │   └── CodeMirror 6
│   └── WysiwygEditor (WYSIWYG Mode)
│       ├── WysiwygToolbar
│       └── Tiptap Editor
│           └── MathInputDialog (when inserting math)
└── Preview Pane (optional)
    └── LatexPreview
        └── LatexRenderer
            └── KaTeX
```

## Data Flow

### Source Mode Flow

```
User Input → CodeMirror → onChange → Content State → LaTeX String
                                                      ↓
                                              LatexPreview
                                                      ↓
                                              LatexRenderer
                                                      ↓
                                                   KaTeX
                                                      ↓
                                                  HTML Output
```

### WYSIWYG Mode Flow

```
User Input → Tiptap → onChange → Content State → LaTeX String
                                              ↓
                                      LatexSerializer
                                              ↓
                                      Tiptap JSON ↔ LaTeX
                                              ↓
                                      LatexPreview
                                              ↓
                                      LatexRenderer
                                              ↓
                                           KaTeX
                                              ↓
                                        HTML Output
```

### Mode Switching Flow

```
Source Mode Content (LaTeX)
        ↓
LatexSerializer.fromLatex()
        ↓
Tiptap JSON Document
        ↓
WysiwygEditor (displays visual content)
        ↓
User edits visually
        ↓
LatexSerializer.toLatex()
        ↓
LaTeX String
        ↓
Source Mode Content (LaTeX)
```

## Key Architectural Decisions

### 1. Client-Side Only
- **Decision**: All processing happens in the browser
- **Rationale**: Privacy, performance, offline support
- **Trade-off**: Limited to browser capabilities

### 2. Dual Editing Modes
- **Decision**: Support both source and WYSIWYG editing
- **Rationale**: Accessibility for non-LaTeX users
- **Trade-off**: Need to maintain bidirectional conversion

### 3. React Components
- **Decision**: Built as React component library
- **Rationale**: Easy integration, modern ecosystem
- **Trade-off**: React dependency required

### 4. TypeScript
- **Decision**: Full TypeScript support
- **Rationale**: Type safety, better developer experience
- **Trade-off**: Slightly larger bundle size

### 5. Modular Architecture
- **Decision**: Separate components for different use cases
- **Rationale**: Flexibility, reusability
- **Trade-off**: More components to understand

## Technology Choices

### CodeMirror 6
- **Purpose**: Source code editing
- **Why**: Modern, extensible, excellent LaTeX support
- **Alternatives Considered**: Monaco Editor, Ace Editor

### Tiptap (ProseMirror)
- **Purpose**: WYSIWYG editing
- **Why**: React-friendly, extensible, good math support
- **Alternatives Considered**: Draft.js, Slate.js

### MathLive
- **Purpose**: Visual math editing
- **Why**: Best-in-class math input experience
- **Alternatives Considered**: MathQuill, custom solution

### KaTeX
- **Purpose**: Math rendering
- **Why**: Fast, reliable, widely used
- **Alternatives Considered**: MathJax

## Module Organization

```
src/
├── components/          # React components
│   ├── LatexEditor.tsx
│   ├── WysiwygEditor.tsx
│   ├── DualModeEditor.tsx
│   ├── LatexPreview.tsx
│   ├── MathInputDialog.tsx
│   └── toolbar/
│       └── WysiwygToolbar.tsx
├── lib/                 # Core utilities
│   ├── latex-renderer.ts
│   ├── latex-serializer.ts
│   ├── latex-lang.ts
│   └── hooks.ts
├── types/               # TypeScript definitions
│   ├── index.ts
│   └── mathlive.d.ts
├── styles/              # CSS styles
│   ├── editor.css
│   ├── wysiwyg.css
│   ├── preview.css
│   └── split-view.css
└── demo/                # Demo application
    ├── App.tsx
    └── sample-content.ts
```

## State Management

### Component State
- Components use React hooks (`useState`, `useCallback`)
- No global state management library required
- State flows down via props, events flow up via callbacks

### Content Synchronization
- Content is synchronized between modes via `LatexSerializer`
- Mode switching triggers conversion
- Content state is managed by parent component

## Performance Considerations

### Debouncing
- Preview updates are debounced to avoid excessive rendering
- Configurable debounce delay (default: 500ms)

### Lazy Loading
- Components can be code-split
- Large libraries (MathLive) load on demand

### Efficient Updates
- Only changed content is re-rendered
- React's reconciliation optimizes DOM updates

## Extensibility Points

1. **Custom Components**: Create wrapper components
2. **Custom Styles**: Override CSS classes
3. **Custom Renderers**: Extend `LatexRenderer`
4. **Custom Serializers**: Extend `LatexSerializer`
5. **Custom Extensions**: Add Tiptap extensions

For detailed technical information, see [Technical Documentation](../technical/architecture.md).

