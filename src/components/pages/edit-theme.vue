<script>
  import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'
  import noSSR from 'vue-no-ssr'
  import {mapGetters,} from 'vuex'
  import semver from 'semver'
  import {cloneDeep, concat,} from 'lodash'
  import {Chrome as colorPicker,} from 'vue-color'
  import parse from '../../shared/usercss-parser'
  import raven from 'raven-js'

  import bSwitch from '../elements/b-switch.vue'
  import oucFooter from '../elements/ouc-footer.vue'
  import navbar from '../elements/navbar.vue'
  import icon from '../elements/icon.vue'
  import notification from '../elements/notification.vue'
  import editor from '../elements/editor.vue'
  import bInput from '../elements/b-input.vue'
  import bTextarea from '../elements/b-textarea.vue'
  import listCreator from '../elements/list-creator.vue'

  const customDictionary = {
    'en': {
      'custom': {
        'content': {
          'required': 'Theme code must not be empty',
        },
        'version': {
          'semver': 'Theme versioning must be semantic',
        },
      },
    },
  }

  export default {
    'components': {
      'b-columns':     bulma('columns', 'div'),
      'b-column':      bulma('column', 'div'),
      'b-box':         bulma('box', 'div'),
      'b-container':   bulma('container', 'div'),
      'b-field':       bulma('field', 'div'),
      'b-label':       bulma('label', 'label'),
      'b-select':      bulma('select', 'select'),
      'b-control':     bulma('control', 'div'),
      'b-checkbox':    bulma('checkbox', 'input'),
      'b-radio':       bulma('radio', 'radio'),
      'b-help':        bulma('help', 'p'),
      'b-tile':        bulma('tile', 'div'),
      'b-level':       bulma('level', 'div'),
      'b-level-left':  bulma('level-left', 'div'),
      'b-level-right': bulma('level-right', 'div'),
      'no-ssr':        noSSR,
      oucFooter,
      navbar,
      icon,
      notification,
      editor,
      bInput,
      bTextarea,
      listCreator,
      colorPicker,
      bSwitch,
    },
    'data': () => {
      return {
        'editedTheme': {
          'title':       '',
          'description': '',
          'version':     '',
          'screenshots': [],
          'content':     '',
          'options':     [],
          'license':     'string',
        },
        'colors': {
          'hex': '#ffffff',
        },
      }
    },
    beforeMount () {
      const self = this

      if (this.$route.params.id) {
        if (this.editedTheme && !this.editedTheme._id) {
          this.$store.dispatch('getFullTheme', this.$route.params.id)
          .then((theme) => {
            theme.user = {
              '_id': theme.user._id,
            }
            self.editedTheme = theme
          })
        } else {
          self.editedTheme = this.$db.getCollection('themes').findOne({
            '_id': this.$route.params.id,
          })
        }
      }

      this.editedTheme.options.forEach((option, index) => {
        const cleanOption = cloneDeep(option)

        Reflect.deleteProperty(cleanOption, '__typename')
        this.editedTheme.options[index] = cleanOption
      })

      this.$validator.extend('semver', (value) => !!semver.valid(value))
      this.$validator.localize(customDictionary)
    },
    'methods': {
      concat,
      async submit () {
        const validated = await this.$validator.validateAll()

        if (validated) {
          const readyTheme = cloneDeep(this.editedTheme)

          this.$store.dispatch('saveTheme', {
            'redirect': `/profile/${this.currentUser._id}`,
            readyTheme,
          })
        }
      },
      createColorsObject (hex) {
        return {
          hex,
        }
      },
      addOption (type) {
        this.editedTheme.options.push({
          type,
        })
      },
      removeOption (index) {
        this.editedTheme.options.splice(index, 1)
      },
      properCase (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      updateColor (colorObj, index) {
        this.editedTheme.options[index].value = colorObj.hex
      },
      renderObjectOption (obj) {
        if (typeof obj === 'string') {
          return obj
        }

        return `${obj.label} - ${obj.value}`
      },
      async parseUserCSS (input) {
        if (input.toLowerCase().includes('==userstyle==')) {
          let parseResult = null

          raven.captureBreadcrumb({
            'event': {
              'name': 'parsing-usercss',
            },
            'contents': {
              'source': input,
            },
          })

          try {
            parseResult = await parse(input)
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error)
            raven.captureException(error)
          }

          const {props, code,} = parseResult

          this.editedTheme.content = code
          this.editedTheme.version = props.version
          this.editedTheme.description = props.description
          this.editedTheme.license = props.license
          this.editedTheme.title = props.title
          this.editedTheme.options = props.vars
        }
      },
    },
    'computed': {
      ...mapGetters([
        'actionErrors',
        'currentUser',
        'loading',
      ]),
      theme () {
        if (!this.$route.params.id) {
          return {}
        }

        return this.$db.getCollection('themes').findOne({
          '_id': this.$route.params.id,
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../client/scss/autocolor';
  @import '../../client/scss/variables';

  textarea[name="description"] {
    resize: vertical;
    height: 200px;
    max-height: 400px;
    min-height: 50px;
  }

  .is-primary {
    background-color: map-get($tones, 'brand-primary');

    a,
    p {
      color: white
    }
  }

  .ouc-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .is-half-width {
    width: 50%
  }

  .is-fullwidth {
    width: 100%
  }

  .is-fullheight {
    height: 100%
  }

  .is-horizontal-spacer {
    display: inline;
    padding-left: .25rem;
    padding-right: .25rem;
  }
</style>

<template lang="pug">
  div.route-root
    b-container
      .section
        notification(v-if="errors.all().length > 0", icon="alert", color="is-danger").is-danger
          div(slot="content")
            p(v-for="error in errors.all()") {{error}}

        form(slot="form", @submit.prevent="submit").ouc-new-theme-form
          b-tile.ouc-new-theme-header(is-parent, is-paddingless)
            b-tile(is-6, is-child)
              h1.is-inline(v-if="$route.params.id") Editing:&nbsp;
              h1.is-inline(v-else="$route.params.id") Creating:&nbsp;
              b-input.is-inline.is-size-7(
                type="text",
                name="title",
                placeholder="Theme title",
                v-validate.disable="'required'",
                v-model="editedTheme.title",
                :class="['input', {'is-danger': errors.has('title')}]"
              )

            b-tile(is-6, is-child)
              button.button.is-pulled-right(
                type="submit",
                is-primary,
                :class="['button', 'is-primary', {'is-loading': loading}]"
              ) Save theme

          br
          b-columns(is-multiline)
            b-column(is-12)
              b-columns
                b-column(is-6)
                  b-field
                    b-control
                      b-textarea(
                        type="text",
                        name="description",
                        placeholder="Theme description",
                        v-validate.disable="'required'",
                        v-model="editedTheme.description",
                        :class="['input', {'is-danger': errors.has('description')}]"
                      )
                b-column(is-6)
                  b-box(is-fullheight)
                    .content
                      vue-markdown(
                        :source="editedTheme.description",
                        :html="false",
                        :anchor-attributes="anchorAttributes"
                      )

            b-column(is-7)
              b-tile(is-parent, is-paddingless, is-vertical)
                b-tile(is-child)
                  b-field
                    b-control(has-icons-left)
                      icon(icon="update")
                      b-input(
                        type="text",
                        name="version",
                        placeholder="Version",
                        v-validate.disable="'required|semver'",
                        v-model="editedTheme.version",
                        :class="['input', {'is-danger': errors.has('version')}]"
                      )

                b-tile(is-child)
                  list-creator(
                    icon="earth",
                    :max-items="10",
                    item-name="screenshot",
                    v-model="editedTheme.screenshots",
                    placeholder="Paste a URL to your image here"
                  ).has-bottom-margin

                b-tile.ouc-new-theme-editor(is-child)
                  b-box(is-paddingless)
                    no-ssr
                      editor(
                        @input="parseUserCSS",
                        v-model="editedTheme.content",
                        name="content",
                        v-validate.disable="'required'",
                        :class="{'is-danger': errors.has('content')}"
                      )

            b-column(is-5)
              b-tile(is-parent, is-vertical)
                b-tile
                  b-tile(is-child, is-6)
                    button.button.is-primary.is-fullwidth(
                      type="button",
                      @click="addOption('text')"
                    ) Add text option
                  b-tile(is-child, is-6)
                    button.button.is-primary.is-fullwidth(
                      type="button",
                      @click="addOption('color')"
                    ) Add color option
                b-tile
                  b-tile(is-child, is-6)
                    button.button.is-primary.is-fullwidth(
                      type="button",
                      @click="addOption('checkbox')"
                    ) Add checkbox option
                  b-tile(is-child, is-6)
                    button.button.is-primary.is-fullwidth(
                      type="button",
                      @click="addOption('select')"
                    ) Add dropdown option

                br
                b-tile(is-parent, is-paddingless, is-vertical)
                  b-tile(v-for="(option, index) in editedTheme.options", is-child)
                    b-box(is-fullwidth)
                      b-level(is-marginless)
                        b-level-left
                          p {{properCase(option.type)}} option
                        b-level-right
                          button.button.is-danger(
                            type="button",
                            @click="removeOption(index)"
                          )
                            icon(icon="close")
                      br
                      b-tile(is-parent, is-paddingless)
                        b-tile(is-child)
                          b-input(
                            type="text",
                            :name="option.type + '-' + index + '-' + 'label'",
                            placeholder="Option label",
                            v-model="editedTheme.options[index].label"
                          )
                        b-tile(is-child)
                          b-input(
                            type="text",
                            :name="option.type + '-' + index + '-' + 'name'",
                            placeholder="Variable name",
                            v-model="editedTheme.options[index].name"
                          )
                        b-tile(is-child, v-if="option.type === 'text'")
                          b-input(
                            type="text",
                            :name="option.type + '-' + index + '-' + 'value'",
                            placeholder="Default value",
                            v-model="editedTheme.options[index].value"
                          )
                        //- b-tile(is-child, v-if="option.type === 'select'")
                          .select.is-fullwidth
                            select(v-model="editedTheme.options[index].value")
                              option(v-for="(value, index) in option.value") {{renderObjectOption(value)}}
                        b-tile(has-text-centered, is-child, v-if="option.type === 'checkbox'")
                          .select.is-fullwidth
                            select(v-model="editedTheme.options[index].value")
                              option(value="checked") Checked
                              option(value="unchecked") Unchecked

                      b-tile(is-parent, is-paddingless, is-vertical, v-if="option.type === 'color'")
                        hr
                        b-tile(is-child)
                          p Default:
                        b-tile(is-child)
                          color-picker.is-fullwidth(
                            :value="createColorsObject(option.value)",
                            @input="(event) => updateColor(event, index)"
                          )

                      b-tile(is-parent, is-paddingless, is-vertical, v-if="option.type === 'select'")
                        hr
                        list-creator(
                          v-model="editedTheme.options[index].value",
                          item-name="value option",
                          max-items=64,
                          placeholder="Value",
                          icon="view-list",
                          :support-objects="true"
                        )

    ouc-footer
</template>
