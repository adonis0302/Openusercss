// import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'

import {noop} from 'lodash'
import CodeMirror from 'codemirror/lib/codemirror'

/* import 'codemirror/mode/meta' */

import 'codemirror/mode/css/css'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/sass/sass'

import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/search/jump-to-line'
import 'codemirror/addon/search/matchesonscrollbar'
import 'codemirror/addon/search/match-highlighter'
import 'codemirror/addon/scroll/annotatescrollbar'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/edit/trailingspace'
import 'codemirror/addon/mode/overlay'

// import './CodeMirror.global.less'

CodeMirror.requireMode = noop
CodeMirror.autoLoadMode = noop

export default {
  async mounted () {
    const element = document.querySelector('textarea.ouc-editor')
    const editor = CodeMirror.fromTextArea(element, {
      'lineNumbers': true,
      'mode':        'css',
      'value':       ''
    })

    console.log(element)
  }
}
