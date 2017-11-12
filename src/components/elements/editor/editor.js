export default {
  'props': {
    'mode': {
      'type':    String,
      'default': 'css'
    },
    'fontsize': {
      'type':    String,
      'default': '12px'
    },
    'codefolding': {
      'type':    String,
      'default': 'markbegin'
    },
    'selectionstyle': {
      'type':    String,
      'default': 'text'
    },
    'highlightline': {
      'type':    Boolean,
      'default': true
    },
    'value': {
      'type':    String,
      'default': ''
    }
  },
  'methods': {
    setMode (editor) {
      const brace = require('brace')
      const editorSession = editor.getSession()
      const modelist = brace.acequire('ace/ext/modelist')
      const {mode} = modelist.modesByName.css

      require('brace/mode/css')
      editorSession.setMode(mode)

      editorSession.setOptions({
        'tabSize': 2
      })
    }
  },
  mounted () {
    const brace = require('brace')

    require('brace/ext/modelist')
    require('brace/ext/themelist')
    require('brace/mode/css')
    const self = this
    const editor = brace.edit('editor')

    this.setMode(editor)

    this.$emit('init', editor)
    editor.$blockScrolling = Infinity

    editor.on('change', () => {
      self.$emit('input', editor.getValue())
    })
  },
  'watch': {
    theme () {
      this.setTheme()
    }
  }
}
