import brace from 'brace'
import 'brace/ext/modelist'
import 'brace/ext/themelist'
import 'brace/mode/css'

const modelist = brace.acequire('ace/ext/modelist')
let editor = null

export default {
  'props': {
    'mode': {
      'type':      String,
      'default':   'css',
      'validator': (val) => modelist.modes.findIndex((mode) => mode.name === val) > -1
    },
    'fontsize': {
      'type':      String,
      'default':   '12px',
      'validator': (val) => parseInt(val, 10) > 11 && parseInt(val, 10) < 25
    },
    'codefolding': {
      'type':      String,
      'default':   'markbegin',
      'validator': (val) => ['manual', 'markbegin', 'markbeginend'].includes(val)
    },
    'selectionstyle': {
      'type':      String,
      'default':   'text',
      'validator': (val) => ['text', 'line'].includes(val)
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
    setMode () {
      const modeObj = modelist.modesByName[this.mode]
      const editorSession = editor.getSession()

      if (modeObj) {
        require(`brace/mode/${modeObj.name}`)
        editorSession.setMode(modeObj.mode)
      }

      editorSession.setOptions({
        'tabSize': 2
      })
    }
  },
  mounted () {
    const self = this

    editor = brace.edit('editor')
    this.setMode()

    this.$emit('init', editor)
    editor.$blockScrolling = Infinity

    editor.on('change', () => {
      self.$emit('input', editor.getValue())
    })
  },
  'watch': {
    mode () {
      this.setMode()
    },
    theme () {
      this.setTheme()
    },
    fontsize (newVal) {
      editor.setFontSize(newVal)
    },
    codefolding (newVal) {
      editor.session.setFoldStyle(newVal)
      editor.setShowFoldWidgets(newVal !== 'manual')
    },
    selectionstyle (newVal) {
      editor.setOption('selectionStyle', newVal)
    },
    highlightline (newVal) {
      editor.setHighlightActiveLine(newVal)
    }
  }
}
