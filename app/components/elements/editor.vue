<script>
  import hat from 'hat'

  export default {
    'props': {
      'mode': {
        'type':    String,
        'default': 'css',
      },
      'fontsize': {
        'type':    String,
        'default': '12px',
      },
      'codefolding': {
        'type':    String,
        'default': 'markbegin',
      },
      'selectionstyle': {
        'type':    String,
        'default': 'text',
      },
      'highlightline': {
        'type':    Boolean,
        'default': true,
      },
      'value': {
        'type':    String,
        'default': '',
      },
    },
    data () {
      return {
        'editor': null,
        'id':     `ouc-editor-${hat()}`,
      }
    },
    'methods': {
      setMode (editor) {
        const editorSession = editor.getSession()

        editorSession.setOptions({
          'tabSize': 2,
        })
      },
    },
    mounted () {
      const brace = require('brace')
      const self = this

      require('brace/ext/modelist')
      require('brace/ext/themelist')
      require('brace/mode/css')
      require('brace/mode/json')
      this.editor = brace.edit(this.id)

      this.editor.getSession().setMode(`ace/mode/${this.mode}`)
      this.$emit('init', this.editor)
      this.editor.$blockScrolling = Infinity

      this.editor.on('input', () => {
        self.$emit('change', self.editor.getValue())
        self.$emit('input', self.editor.getValue())
      })

      this.editor.setValue(this.value, 0)
      this.editor.clearSelection()
    },
    'watch': {
      value (data) {
        if (this.editor.getValue() !== data) {
          this.editor.setValue(data, 0)
          this.editor.clearSelection()
        }
      },
    },
  }
</script>

<style lang="scss">
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../scss/autocolor';
  @import '../../scss/variables';

  $primary: nth(map-get($colors, 'primary'), 1);
  $secondary: nth(map-get($colors, 'secondary'), 1);
  $background: nth(map-get($colors, 'background'), 1);
  $highlight: nth(map-get($colors, 'highlight'), 1);
  $danger: nth(map-get($colors, 'danger'), 1);

  .ouc-editor {
    // Editor environment

    background-color: $white;
    color: $black;
    height: 400px;

    span {
      font-size: 12px !important;
    }

    .ace_gutter {
      background: $white-ter;
      color: $black;
      overflow: hidden;
    }

    .ace_print-margin {
      width: .2rem;
      background: $white-ter
    }

    // Editor elements

    .ace_cursor {
      border-color: $primary;
    }

    .ace_warning {
      background-image: url('/img/warning.icon-x32.png') !important;
      background-size: contain;
    }

    .ace_error {
      background-image: url('/img/error.icon-x32.png') !important;
      background-size: contain;
    }

    .ace_tooltip {
      background-color: $primary;
      background-image: none;
      border: 0;
      box-shadow: 0 10px 50px -15px rgba(0, 0, 0, .65);
      color: text-for-bg($primary);
      font-family: $family-primary;
      font-size: 14px;
      padding-top: .5rem;
      padding-bottom: .5rem;
      padding-left: 1rem;
      padding-right: 1rem;
    }

    // Editor text

    .ace_invisible {
      color: $grey-lighter;
    }

    .ace_constant {
      color: $primary;
    }

    .ace_invalid {
      color: $danger;
    }

    .ace_comment {
      color: $grey;
    }

    .ace-support {
      color: ligten($primary, 15);
    }

    .ace_keyword.ace_operator {
      color: $background;
    }

    .ace_constant.ace_numeric {
      color: darken($secondary, 10);
    }

    .ace_string {
      color: $highlight;
    }

    .ace_variable {
      color: $primary;
    }

    .ace_function {
      color: $black;
    }

    .ace_support {
      color: $background;
    }
  }
</style>

<template lang="pug">
  div.ouc-editor-wrapper
    .ouc-editor(:id="id")
</template>
