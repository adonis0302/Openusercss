import brace from 'brace'
import 'brace/ext/modelist'
import 'brace/ext/themelist'
import 'brace/mode/css'

const modelist = brace.acequire('ace/ext/modelist')

let editor = null
const regMap = {
  'isInt': new RegExp('^\\d+$')
}

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
    'softwrap': {
      'type':      String,
      'default':   'free',
      'validator': (val) => ['off', 'free'].includes(val) || regMap.isInt.test(val)
    },
    'selectionstyle': {
      'type':      String,
      'default':   'text',
      'validator': (val) => ['text', 'line'].includes(val)
    },
    'highlightline': {
      'type':    Boolean,
      'default': true
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
    },
    emitCode (action, session) {
      this.$emit('code-change', editor.getValue())
    }
  },
  mounted () {
    editor = brace.edit('editor')
    this.setMode()
    editor.$blockScrolling = Infinity
    editor.getSession().on('change', this.emitCode)
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
    softwrap (newVal) {
      editor.setOption('wrap', newVal)
    },
    selectionstyle (newVal) {
      editor.setOption('selectionStyle', newVal)
    },
    highlightline (newVal) {
      editor.setHighlightActiveLine(newVal)
    }
  }
}
