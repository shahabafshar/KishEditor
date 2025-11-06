import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * Custom hook for debouncing values
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for managing editor content with onChange callback
 */
export function useEditorContent(
  initialContent: string = '',
  onChange?: (content: string) => void
) {
  const [content, setContent] = useState(initialContent);
  const onChangeRef = useRef(onChange);

  // Keep the ref updated
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    if (onChangeRef.current) {
      onChangeRef.current(newContent);
    }
  }, []);

  return [content, handleContentChange] as const;
}
