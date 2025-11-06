import { useState } from 'react';
import { DualModeEditor } from '../components/DualModeEditor';
import { sampleArticle } from './sample-content';
import '../styles/wysiwyg.css';
import './App.css';

function App() {
  const [content, setContent] = useState(sampleArticle);

  return (
    <div className="app">
      <main className="app-main">
        <DualModeEditor
          initialContent={content}
          onChange={setContent}
          height="100vh"
          initialMode="wysiwyg"
          showPreview={true}
          previewDebounce={300}
        />
      </main>


    </div>
  );
}

export default App;
