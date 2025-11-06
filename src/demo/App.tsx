import { useState } from 'react';
import { LatexEditorWithPreview } from '../components/LatexEditorWithPreview';
import { sampleArticle, sampleMath, simpleExample } from './sample-content';
import './App.css';

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState('article');
  const [content, setContent] = useState(sampleArticle);

  const templates: Record<string, string> = {
    article: sampleArticle,
    math: sampleMath,
    simple: simpleExample
  };

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    setContent(templates[template] || '');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>LaTeX Editor</h1>
        <p className="app-subtitle">Client-side Overleaf Clone</p>
      </header>

      <div className="app-toolbar">
        <div className="toolbar-section">
          <label htmlFor="template-select">Template: </label>
          <select
            id="template-select"
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="template-select"
          >
            <option value="simple">Simple Example</option>
            <option value="article">Article Template</option>
            <option value="math">Math Formulas</option>
          </select>
        </div>

        <div className="toolbar-section">
          <span className="toolbar-info">
            Edit the LaTeX code to see live preview
          </span>
        </div>
      </div>

      <main className="app-main">
        <LatexEditorWithPreview
          initialContent={content}
          onChange={setContent}
          height="calc(100vh - 180px)"
          previewDebounce={300}
          onPreviewError={(error) => {
            console.error('Preview error:', error);
          }}
        />
      </main>

      <footer className="app-footer">
        <p>
          Built with React, TypeScript, CodeMirror, and KaTeX
        </p>
      </footer>
    </div>
  );
}

export default App;
