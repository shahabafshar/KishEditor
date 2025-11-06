# Integration Guide

This guide provides detailed examples for integrating KishEditor into various project types and frameworks.

## React Applications

### Basic Integration

```tsx
import React, { useState } from 'react';
import { DualModeEditor } from 'kish-editor';
import 'kish-editor/dist/style.css';

function App() {
  const [content, setContent] = useState('\\section{Hello}');

  return (
    <DualModeEditor
      initialContent={content}
      onChange={setContent}
      height="100vh"
    />
  );
}
```

### With State Management

```tsx
import { useState, useCallback } from 'react';
import { DualModeEditor } from 'kish-editor';

function EditorWithState() {
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = useCallback((newContent: string) => {
    setContent(newContent);
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(async () => {
    await saveToBackend(content);
    setIsDirty(false);
  }, [content]);

  return (
    <>
      <DualModeEditor
        initialContent={content}
        onChange={handleChange}
      />
      <button onClick={handleSave} disabled={!isDirty}>
        Save
      </button>
    </>
  );
}
```

## Next.js Applications

### App Router (Next.js 13+)

Create a client component:

```tsx
// app/components/LatexEditor.tsx
'use client';

import dynamic from 'next/dynamic';
import type { DualModeEditorProps } from 'kish-editor';

const DualModeEditor = dynamic(
  () => import('kish-editor').then(mod => mod.DualModeEditor),
  {
    ssr: false,
    loading: () => <div>Loading editor...</div>
  }
);

export default function LatexEditor(props: DualModeEditorProps) {
  return <DualModeEditor {...props} />;
}
```

Use in a page:

```tsx
// app/editor/page.tsx
import LatexEditor from '@/app/components/LatexEditor';

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

const DualModeEditor = dynamic(
  () => import('kish-editor').then(mod => mod.DualModeEditor),
  { ssr: false }
);

export default function EditorPage() {
  return <DualModeEditor />;
}
```

## Vite Projects

Works out of the box:

```tsx
// src/App.tsx
import { DualModeEditor } from 'kish-editor';
import 'kish-editor/dist/style.css';

function App() {
  return <DualModeEditor />;
}

export default App;
```

## Create React App

No special configuration needed:

```tsx
// src/App.js
import React from 'react';
import { DualModeEditor } from 'kish-editor';
import 'kish-editor/dist/style.css';

function App() {
  return (
    <div className="App">
      <DualModeEditor height="100vh" />
    </div>
  );
}

export default App;
```

## TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true
  }
}
```

## Styling Integration

### CSS Modules

```tsx
// Editor.module.css
.editorContainer {
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 16px;
}

// Editor.tsx
import styles from './Editor.module.css';
import { DualModeEditor } from 'kish-editor';

export function Editor() {
  return (
    <DualModeEditor
      className={styles.editorContainer}
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
  }
`;

export function Editor() {
  return (
    <StyledEditor>
      <DualModeEditor />
    </StyledEditor>
  );
}
```

### Tailwind CSS

```tsx
import { DualModeEditor } from 'kish-editor';

export function Editor() {
  return (
    <div className="border-2 border-gray-300 rounded-lg p-4">
      <DualModeEditor className="custom-editor" />
    </div>
  );
}
```

## Advanced Integration Patterns

### With React Context

```tsx
// EditorContext.tsx
import { createContext, useContext, useState } from 'react';

const EditorContext = createContext(null);

export function EditorProvider({ children }) {
  const [content, setContent] = useState('');

  return (
    <EditorContext.Provider value={{ content, setContent }}>
      {children}
    </EditorContext.Provider>
  );
}

export const useEditor = () => useContext(EditorContext);

// Usage
import { EditorProvider, useEditor } from './EditorContext';
import { DualModeEditor } from 'kish-editor';

function EditorComponent() {
  const { content, setContent } = useEditor();

  return (
    <DualModeEditor
      initialContent={content}
      onChange={setContent}
    />
  );
}
```

### With Redux

```tsx
// editorSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const editorSlice = createSlice({
  name: 'editor',
  initialState: { content: '' },
  reducers: {
    setContent: (state, action) => {
      state.content = action.payload;
    }
  }
});

export const { setContent } = editorSlice.actions;
export default editorSlice.reducer;

// EditorComponent.tsx
import { useDispatch, useSelector } from 'react-redux';
import { setContent } from './editorSlice';
import { DualModeEditor } from 'kish-editor';

function EditorComponent() {
  const dispatch = useDispatch();
  const content = useSelector(state => state.editor.content);

  return (
    <DualModeEditor
      initialContent={content}
      onChange={(newContent) => dispatch(setContent(newContent))}
    />
  );
}
```

### With Local Storage

```tsx
import { useState, useEffect } from 'react';
import { DualModeEditor } from 'kish-editor';

function PersistentEditor() {
  const [content, setContent] = useState(() => {
    return localStorage.getItem('latex-content') || '';
  });

  useEffect(() => {
    localStorage.setItem('latex-content', content);
  }, [content]);

  return (
    <DualModeEditor
      initialContent={content}
      onChange={setContent}
    />
  );
}
```

### With Backend API

```tsx
import { useState, useEffect } from 'react';
import { DualModeEditor } from 'kish-editor';

function EditorWithBackend({ documentId }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from backend
    fetch(`/api/documents/${documentId}`)
      .then(res => res.json())
      .then(data => {
        setContent(data.content);
        setLoading(false);
      });
  }, [documentId]);

  const handleSave = async () => {
    await fetch(`/api/documents/${documentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <DualModeEditor
        initialContent={content}
        onChange={setContent}
      />
      <button onClick={handleSave}>Save</button>
    </>
  );
}
```

## Error Handling

```tsx
import { DualModeEditor } from 'kish-editor';

function EditorWithErrorHandling() {
  return (
    <DualModeEditor
      onPreviewError={(error) => {
        console.error('Preview error:', error);
        // Show error notification
        toast.error('Failed to render preview');
      }}
    />
  );
}
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
    <Suspense fallback={<div>Loading editor...</div>}>
      <DualModeEditor />
    </Suspense>
  );
}
```

### Debouncing

```tsx
import { useDebounce } from 'kish-editor';
import { useState } from 'react';

function EditorWithDebounce() {
  const [content, setContent] = useState('');
  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    // Save debounced content
    saveToBackend(debouncedContent);
  }, [debouncedContent]);

  return (
    <DualModeEditor
      initialContent={content}
      onChange={setContent}
    />
  );
}
```

For more examples, see [Usage Examples](./usage-examples.md).

