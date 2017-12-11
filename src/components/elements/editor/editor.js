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
  data () {
    return {
      'editor': null
    }
  },
  'methods': {
    setMode (editor) {
      const editorSession = editor.getSession()

      editorSession.setOptions({
        'tabSize': 2
      })
    }
  },
  mounted () {
    const brace = require('brace')
    const self = this

    require('brace/ext/modelist')
    require('brace/ext/themelist')
    require('brace/mode/css')
    this.editor = brace.edit('editor')

    this.setMode(this.editor)
    this.$emit('init', this.editor)
    this.editor.$blockScrolling = Infinity

    this.editor.on('change', () => {
      self.$emit('input', self.editor.getValue())
    })
  },
  'watch': {
    theme () {
      this.setTheme()
    },
    value (data) {
      if (this.editor.getValue() !== data) {
        this.editor.setValue(data, 0)
        this.editor.clearSelection()
      }
    }
  }
}
