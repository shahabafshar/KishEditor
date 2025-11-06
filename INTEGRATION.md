# Integration Guide

This guide provides detailed examples of how to integrate KishEditor into various project types.

## Table of Contents

- [React Applications](#react-applications)
- [Next.js Applications](#nextjs-applications)
- [Vite Projects](#vite-projects)
- [Create React App](#create-react-app)
- [TypeScript Configuration](#typescript-configuration)
- [Styling Customization](#styling-customization)

## React Applications

### Basic Integration

```tsx
import React, { useState } from 'react';
import { LatexEditorWithPreview } from 'kish-editor';

export function MyLatexEditor() {
  const [content, setContent] = useState('\\section{Hello}');

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <LatexEditorWithPreview
        initialContent={content}
        onChange={setContent}
        height="100%"
      />
    </div>
  );
}
```

### With Save Functionality

```tsx
import React, { useState, useCallback } from 'react';
import { LatexEditorWithPreview } from 'kish-editor';

export function EditorWithSave() {
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(true);

  const handleChange = useCallback((newContent: string) => {
    setContent(newContent);
    setSaved(false);
  }, []);

  const handleSave = useCallback(async () => {
    // Save to your backend
    await fetch('/api/documents/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    setSaved(true);
  }, [content]);

  return (
    <div>
      <button onClick={handleSave} disabled={saved}>
        {saved ? 'Saved' : 'Save'}
      </button>
      <LatexEditorWithPreview
        initialContent={content}
        onChange={handleChange}
      />
    </div>
  );
}
```

## Next.js Applications

### App Router (Next.js 13+)

Create a client component:

```tsx
// components/LatexEditor.tsx
'use client';

import dynamic from 'next/dynamic';
import { LatexEditorWithPreviewProps } from 'kish-editor';

const LatexEditorWithPreview = dynamic(
  () => import('kish-editor').then(mod => mod.LatexEditorWithPreview);
  {
    ssr: false,
    loading: () => <div>Loading editor...</div>
  }
);

export default function LatexEditor(props: LatexEditorWithPreviewProps) {
  return <LatexEditorWithPreview {...props} />;
}
```

Use it in your page:

```tsx
// app/editor/page.tsx
import LatexEditor from '@/components/LatexEditor';

export default function EditorPage() {
  return (
    <main style={{ height: '100vh' }}>
      <LatexEditor
        initialContent="\\section{Welcome}"
        height="100%"
      />
    </main>
  );
}
```

### Pages Router (Next.js 12 and earlier)

```tsx
// pages/editor.tsx
import dynamic from 'next/dynamic';

const LatexEditor = dynamic(
  () => import('kish-editor').then(mod => mod.LatexEditorWithPreview);
  { ssr: false }
);

export default function EditorPage() {
  return <LatexEditor />;
}
```

## Vite Projects

Vite works out of the box. Just import and use:

```tsx
import { LatexEditorWithPreview } from 'kish-editor';

function App() {
  return <LatexEditorWithPreview />;
}
```

## Create React App

CRA works without additional configuration:

```tsx
import React from 'react';
import { LatexEditorWithPreview } from 'kish-editor';

function App() {
  return (
    <div className="App">
      <LatexEditorWithPreview height="100vh" />
    </div>
  );
}

export default App;
```

## TypeScript Configuration

If you're using TypeScript, the types are included automatically. For better intellisense:

```tsx
import type {
  LatexEditorProps,
  LatexEditorWithPreviewProps
} from 'kish-editor';

const editorConfig: LatexEditorWithPreviewProps = {
  initialContent: '\\section{Title}',
  onChange: (content) => console.log(content),
  height: '600px',
  previewDebounce: 500
};

function MyEditor() {
  return <LatexEditorWithPreview {...editorConfig} />;
}
```

## Styling Customization

### Override Default Styles

```css
/* In your global CSS file */

/* Change editor background */
.latex-editor-container {
  background-color: #1e1e1e;
}

/* Change preview background */
.latex-preview {
  background-color: #ffffff;
  padding: 40px;
}

/* Customize split view */
.latex-split-view {
  background-color: #f0f0f0;
  gap: 16px;
}

/* Customize syntax highlighting */
.cm-latex-command {
  color: #0077cc;
}
```

### Using CSS Modules

```tsx
// MyEditor.module.css
.editorContainer {
  border: 2px solid #ccc;
  border-radius: 8px;
}

// MyEditor.tsx
import styles from './MyEditor.module.css';
import { LatexEditorWithPreview } from 'kish-editor';

export function MyEditor() {
  return (
    <LatexEditorWithPreview
      className={styles.editorContainer}
    />
  );
}
```

### With Styled Components

```tsx
import styled from 'styled-components';
import { LatexEditorWithPreview } from 'kish-editor';

const StyledEditorContainer = styled.div`
  .latex-split-view {
    background: linear-gradient(to bottom, #f0f0f0, #ffffff);
    border-radius: 12px;
    overflow: hidden;
  }

  .latex-editor {
    font-size: 16px;
  }
`;

export function StyledEditor() {
  return (
    <StyledEditorContainer>
      <LatexEditorWithPreview />
    </StyledEditorContainer>
  );
}
```

## Advanced Integration Examples

### With React Context

```tsx
// EditorContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface EditorContextType {
  content: string;
  setContent: (content: string) => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState('');

  return (
    <EditorContext.Provider value={{ content, setContent }}>
      {children}
    </EditorContext.Provider>
  );
}

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error('useEditor must be used within EditorProvider');
  return context;
};

// Usage
import { LatexEditorWithPreview } from 'kish-editor';

function EditorComponent() {
  const { content, setContent } = useEditor();

  return (
    <LatexEditorWithPreview
      initialContent={content}
      onChange={setContent}
    />
  );
}
```

### With Redux

```tsx
// editorSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditorState {
  content: string;
}

const initialState: EditorState = {
  content: ''
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    }
  }
});

export const { setContent } = editorSlice.actions;
export default editorSlice.reducer;

// EditorComponent.tsx
import { useDispatch, useSelector } from 'react-redux';
import { setContent } from './editorSlice';
import { LatexEditorWithPreview } from 'kish-editor';

function EditorComponent() {
  const dispatch = useDispatch();
  const content = useSelector((state: RootState) => state.editor.content);

  return (
    <LatexEditorWithPreview
      initialContent={content}
      onChange={(newContent) => dispatch(setContent(newContent))}
    />
  );
}
```

### With Local Storage Persistence

```tsx
import React, { useState, useEffect } from 'react';
import { LatexEditorWithPreview } from 'kish-editor';

function PersistentEditor() {
  const [content, setContent] = useState(() => {
    // Load from localStorage on mount
    return localStorage.getItem('latex-content') || '';
  });

  useEffect(() => {
    // Save to localStorage whenever content changes
    localStorage.setItem('latex-content', content);
  }, [content]);

  return (
    <LatexEditorWithPreview
      initialContent={content}
      onChange={setContent}
    />
  );
}
```

## Troubleshooting

### Module Not Found

If you get "Module not found" errors:

1. Ensure the package is installed:
   ```bash
   npm install kish-editor
   ```

2. Clear cache and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Styles Not Loading

If styles aren't applied:

1. Make sure to import the component (styles are included automatically)
2. Check if your bundler supports CSS imports
3. For some setups, you may need to import styles explicitly:
   ```tsx
   import 'kish-editor/dist/style.css';
   ```

### SSR Issues (Next.js)

Always use dynamic imports with `ssr: false` for Next.js:

```tsx
const LatexEditor = dynamic(
  () => import('kish-editor').then(mod => mod.LatexEditorWithPreview);
  { ssr: false }
);
```

### TypeScript Errors

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "jsx": "react-jsx"
  }
}
```
