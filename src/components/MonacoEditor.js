import React, { Component } from 'react'

class MonacoEditor extends Component {
  render() {
    return <div id="container"></div>
  }

  componentDidMount() {
    import('monaco-editor').then((monaco) => {
      // Configure the Monaco editor to run web workers from the same origin as the host page.
      window.MonacoEnvironment = {
        getWorkerUrl: function (workerId, label) {
          return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
                self.MonacoEnvironment = { baseUrl: '${window.location.origin}/' };
            `)}`;
        }
      };

      const libraries = this.props.libraries || []
      libraries.forEach((library) => {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          library.content,
          `file:///node_modules/@types/jinaga/${library.path}`
        )
      })
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        'import { Jinaga, buildModel, User } from "jinaga"; declare global { const j: Jinaga; } export { buildModel, User };',
        'file:///globals.d.ts'
      )

      const code = this.props.content || ''
      const model = monaco.editor.createModel(
        code,
        'typescript',
        monaco.Uri.parse('file:///main.ts')
      )
      this.editor = monaco.editor.create(document.getElementById('container'), {
        model,
        minimap: {
          enabled: false,
        },
      })

      window.addEventListener('resize', () => {
        this.editor.layout()
      })
    })
  }

  getValue() {
    return this.editor.getValue()
  }
}

export default MonacoEditor
