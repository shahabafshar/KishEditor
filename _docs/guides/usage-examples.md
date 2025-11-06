# Usage Examples

Practical code examples for using KishEditor in various scenarios.

## Basic Examples

### Simple Editor

```tsx
import { DualModeEditor } from 'kish-editor';
import 'kish-editor/dist/style.css';

function SimpleEditor() {
  return <DualModeEditor height="600px" />;
}
```

### Editor with Initial Content

```tsx
import { DualModeEditor } from 'kish-editor';

function EditorWithContent() {
  const initialContent = `
\\documentclass{article}
\\begin{document}
\\section{Hello World}
This is a sample document.
\\end{document}
  `;

  return (
    <DualModeEditor
      initialContent={initialContent}
      height="600px"
    />
  );
}
```

### Controlled Component

```tsx
import { useState } from 'react';
import { DualModeEditor } from 'kish-editor';

function ControlledEditor() {
  const [content, setContent] = useState('\\section{Hello}');

  return (
    <DualModeEditor
      initialContent={content}
      onChange={setContent}
      height="600px"
    />
  );
}
```

## Advanced Examples

### Editor with Save Functionality

```tsx
import { useState, useCallback } from 'react';
import { DualModeEditor } from 'kish-editor';

function EditorWithSave() {
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleChange = useCallback((newContent: string) => {
    setContent(newContent);
    setSaved(false);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      setSaved(true);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  }, [content]);

  return (
    <div>
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <button onClick={handleSave} disabled={saved || saving}>
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
        </button>
      </div>
      <DualModeEditor
        initialContent={content}
        onChange={handleChange}
        height="calc(100vh - 60px)"
      />
    </div>
  );
}
```

### Editor with Auto-Save

```tsx
import { useState, useEffect } from 'react';
import { useDebounce } from 'kish-editor';
import { DualModeEditor } from 'kish-editor';

function AutoSaveEditor() {
  const [content, setContent] = useState('');
  const debouncedContent = useDebounce(content, 2000); // 2 second delay

  useEffect(() => {
    if (debouncedContent) {
      // Auto-save after 2 seconds of no typing
      fetch('/api/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: debouncedContent })
      });
    }
  }, [debouncedContent]);

  return (
    <DualModeEditor
      initialContent={content}
      onChange={setContent}
      height="600px"
    />
  );
}
```

### Editor with Mode Persistence

```tsx
import { useState, useEffect } from 'react';
import { DualModeEditor } from 'kish-editor';
import type { EditorMode } from 'kish-editor';

function EditorWithModePersistence() {
  const [mode, setMode] = useState<EditorMode>(() => {
    const saved = localStorage.getItem('editor-mode');
    return (saved === 'source' || saved === 'wysiwyg') ? saved : 'source';
  });

  useEffect(() => {
    localStorage.setItem('editor-mode', mode);
  }, [mode]);

  return (
    <DualModeEditor
      initialMode={mode}
      onModeChange={setMode}
      height="600px"
    />
  );
}
```

### Editor with Template Selection

```tsx
import { useState } from 'react';
import { DualModeEditor } from 'kish-editor';

const templates = {
  article: `\\documentclass{article}
\\begin{document}
\\section{Introduction}
\\end{document}`,
  letter: `\\documentclass{letter}
\\begin{document}
Dear Sir/Madam,
\\end{document}`,
  report: `\\documentclass{report}
\\begin{document}
\\chapter{Introduction}
\\end{document}`
};

function EditorWithTemplates() {
  const [content, setContent] = useState(templates.article);
  const [selectedTemplate, setSelectedTemplate] = useState('article');

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    setContent(templates[template]);
  };

  return (
    <div>
      <div style={{ padding: '10px' }}>
        <label>Template: </label>
        <select
          value={selectedTemplate}
          onChange={(e) => handleTemplateChange(e.target.value)}
        >
          <option value="article">Article</option>
          <option value="letter">Letter</option>
          <option value="report">Report</option>
        </select>
      </div>
      <DualModeEditor
        initialContent={content}
        onChange={setContent}
        height="calc(100vh - 60px)"
      />
    </div>
  );
}
```

## Component-Specific Examples

### Source Editor Only

```tsx
import { LatexEditor } from 'kish-editor';

function SourceOnlyEditor() {
  return (
    <LatexEditor
      initialContent="\\section{Hello}"
      onChange={(content) => console.log(content)}
      height="400px"
    />
  );
}
```

### WYSIWYG Editor Only

```tsx
import { WysiwygEditor } from 'kish-editor';

function WysiwygOnlyEditor() {
  return (
    <WysiwygEditor
      initialContent="\\section{Hello}"
      onChange={(latex) => console.log(latex)}
      height="600px"
    />
  );
}
```

### Preview Only

```tsx
import { LatexPreview } from 'kish-editor';

function PreviewOnly() {
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

### Editor with Preview (Separate)

```tsx
import { LatexEditor, LatexPreview } from 'kish-editor';
import { useState } from 'react';

function SeparateEditorPreview() {
  const [content, setContent] = useState('');

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <LatexEditor
          initialContent={content}
          onChange={setContent}
          height="600px"
        />
      </div>
      <div style={{ flex: 1 }}>
        <LatexPreview
          content={content}
          height="600px"
        />
      </div>
    </div>
  );
}
```

## Real-World Examples

### Document Editor with Toolbar

```tsx
import { useState } from 'react';
import { DualModeEditor } from 'kish-editor';

function DocumentEditor() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Untitled Document');

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document Title"
          style={{ marginRight: '10px' }}
        />
        <button>Save</button>
        <button>Export PDF</button>
      </div>

      {/* Editor */}
      <div style={{ flex: 1 }}>
        <DualModeEditor
          initialContent={content}
          onChange={setContent}
          height="100%"
        />
      </div>
    </div>
  );
}
```

### Multi-Document Editor

```tsx
import { useState } from 'react';
import { DualModeEditor } from 'kish-editor';

interface Document {
  id: string;
  title: string;
  content: string;
}

function MultiDocumentEditor() {
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', title: 'Document 1', content: '\\section{First}' },
    { id: '2', title: 'Document 2', content: '\\section{Second}' }
  ]);
  const [activeId, setActiveId] = useState('1');

  const activeDoc = documents.find(d => d.id === activeId);

  const handleContentChange = (content: string) => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === activeId ? { ...doc, content } : doc
      )
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '200px', borderRight: '1px solid #ccc' }}>
        {documents.map(doc => (
          <div
            key={doc.id}
            onClick={() => setActiveId(doc.id)}
            style={{
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: activeId === doc.id ? '#f0f0f0' : 'white'
            }}
          >
            {doc.title}
          </div>
        ))}
      </div>

      {/* Editor */}
      <div style={{ flex: 1 }}>
        {activeDoc && (
          <DualModeEditor
            initialContent={activeDoc.content}
            onChange={handleContentChange}
            height="100%"
          />
        )}
      </div>
    </div>
  );
}
```

### Editor with Validation

```tsx
import { useState } from 'react';
import { DualModeEditor } from 'kish-editor';

function EditorWithValidation() {
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (latex: string): string[] => {
    const errs: string[] = [];
    
    if (!latex.includes('\\begin{document}')) {
      errs.push('Missing \\begin{document}');
    }
    
    if (!latex.includes('\\end{document}')) {
      errs.push('Missing \\end{document}');
    }

    return errs;
  };

  const handleChange = (newContent: string) => {
    setContent(newContent);
    setErrors(validate(newContent));
  };

  return (
    <div>
      {errors.length > 0 && (
        <div style={{ padding: '10px', backgroundColor: '#fee', color: '#c00' }}>
          <strong>Errors:</strong>
          <ul>
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <DualModeEditor
        initialContent={content}
        onChange={handleChange}
        height="600px"
      />
    </div>
  );
}
```

For more integration patterns, see [Integration Guide](./integration.md).

