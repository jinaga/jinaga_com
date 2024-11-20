import React, { Component } from 'react';

// Import the necessary worker scripts using worker-loader
import EditorWorker from 'worker-loader!monaco-editor/esm/vs/editor/editor.worker.js';
import TsWorker from 'worker-loader!monaco-editor/esm/vs/language/typescript/ts.worker.js';

class MonacoEditor extends Component {
  render() {
    return <div id="container"></div>;
  }

  componentDidMount() {
    import('monaco-editor').then((monaco) => {
      // Configure the Monaco editor to use the imported workers
      window.MonacoEnvironment = {
        getWorker: function (moduleId, label) {
          if (label === 'typescript' || label === 'javascript') {
            return new TsWorker();
          }
          return new EditorWorker();
        }
      };

      // Set up extra libraries and models
      const libraries = this.props.libraries || [];
      libraries.forEach((library) => {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          library.content,
          `file:///node_modules/@types/jinaga/${library.path}`
        );
      });
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        'import { Jinaga, buildModel, User } from "jinaga"; declare global { const j: Jinaga; } export { buildModel, User };',
        'file:///globals.d.ts'
      );

      const code = this.props.content || '';
      const model = monaco.editor.createModel(
        code,
        'typescript',
        monaco.Uri.parse('file:///main.ts')
      );
      this.editor = monaco.editor.create(document.getElementById('container'), {
        model,
        minimap: {
          enabled: false,
        },
      });

      window.addEventListener('resize', () => {
        this.editor.layout();
      });
    });
  }

  getValue() {
    return this.editor.getValue();
  }
}

export default MonacoEditor;
