# Hooks API

Reference for custom React hooks in KishEditor.

## useDebounce

Debounces a value, updating it only after the specified delay has passed since the last change.

### Signature

```typescript
function useDebounce<T>(value: T, delay: number): T
```

### Parameters

- `value` (T): The value to debounce
- `delay` (number): Delay in milliseconds

### Returns

Debounced value of type T

### Example

```typescript
import { useDebounce } from 'kish-editor';
import { useState } from 'react';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    // This effect runs 500ms after user stops typing
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### Use Cases

- **Preview Updates**: Debounce preview rendering to avoid excessive updates
- **Search**: Debounce search input to reduce API calls
- **Form Validation**: Debounce validation to avoid constant checks

### Implementation Details

- Uses `useState` and `useEffect` internally
- Cleans up timeout on unmount
- Updates debounced value only after delay period

## useEditorContent

Manages editor content state with onChange callback support.

### Signature

```typescript
function useEditorContent(
  initialContent?: string,
  onChange?: (content: string) => void
): [string, (content: string) => void]
```

### Parameters

- `initialContent` (string, optional): Initial content value
- `onChange` (function, optional): Callback when content changes

### Returns

Tuple containing:
- `content` (string): Current content value
- `setContent` (function): Function to update content

### Example

```typescript
import { useEditorContent } from 'kish-editor';

function EditorComponent() {
  const [content, setContent] = useEditorContent('', (newContent) => {
    console.log('Content changed:', newContent);
    // Save to backend, update state, etc.
  });

  return <div>{content}</div>;
}
```

### Use Cases

- **Content Management**: Manage editor content with automatic onChange handling
- **State Synchronization**: Keep content in sync with external state
- **Simplified State**: Reduce boilerplate for content management

### Implementation Details

- Uses `useState` for content state
- Uses `useRef` to store onChange callback
- Uses `useCallback` for setContent function
- Updates onChange ref when prop changes

## Usage Patterns

### Combining Hooks

```typescript
import { useDebounce, useEditorContent } from 'kish-editor';

function EditorWithDebouncedPreview() {
  const [content, setContent] = useEditorContent('');
  const debouncedContent = useDebounce(content, 500);

  return (
    <>
      <Editor onChange={setContent} />
      <Preview content={debouncedContent} />
    </>
  );
}
```

### With External State

```typescript
import { useEditorContent } from 'kish-editor';
import { useState, useEffect } from 'react';

function EditorWithSync() {
  const [externalContent, setExternalContent] = useState('');
  const [content, setContent] = useEditorContent(
    externalContent,
    (newContent) => {
      setExternalContent(newContent);
      // Sync with backend
    }
  );

  // Sync when external content changes
  useEffect(() => {
    if (externalContent !== content) {
      setContent(externalContent);
    }
  }, [externalContent]);

  return <Editor content={content} onChange={setContent} />;
}
```

### Custom Hook Composition

```typescript
import { useDebounce } from 'kish-editor';

function useDebouncedEditor(onChange: (content: string) => void) {
  const [content, setContent] = useState('');
  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    onChange(debouncedContent);
  }, [debouncedContent, onChange]);

  return [content, setContent] as const;
}
```

## Performance Considerations

### Debounce Delay

Choose appropriate delay based on use case:

- **Fast Typing**: 100-300ms for immediate feedback
- **Preview Updates**: 300-500ms to balance responsiveness and performance
- **API Calls**: 500-1000ms to reduce server load

### Memoization

Hooks are already optimized, but you can memoize callbacks:

```typescript
const handleChange = useCallback((content: string) => {
  // Expensive operation
  processContent(content);
}, [/* dependencies */]);

const [content, setContent] = useEditorContent('', handleChange);
```

## Type Safety

### Generic Types

```typescript
// useDebounce supports any type
const debouncedString = useDebounce<string>('hello', 500);
const debouncedNumber = useDebounce<number>(42, 500);
const debouncedObject = useDebounce<{ value: string }>({ value: 'test' }, 500);
```

### Type Inference

TypeScript infers types automatically:

```typescript
const [content, setContent] = useEditorContent('');
// content: string
// setContent: (content: string) => void
```

## Common Patterns

### Debounced Preview

```typescript
function EditorWithPreview() {
  const [content, setContent] = useState('');
  const debouncedContent = useDebounce(content, 500);

  return (
    <div>
      <Editor onChange={setContent} />
      <Preview content={debouncedContent} />
    </div>
  );
}
```

### Auto-Save

```typescript
function EditorWithAutoSave() {
  const [content, setContent] = useEditorContent('', async (newContent) => {
    await saveToBackend(newContent);
  });

  return <Editor onChange={setContent} />;
}
```

### Search with Debounce

```typescript
function SearchEditor() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

For more details on components that use these hooks, see [Components API](./components.md).

