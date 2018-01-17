<script>
  import noSSR from 'vue-no-ssr'
  import {mapGetters,} from 'vuex'
  import semver from 'semver'
  import {cloneDeep, concat,} from 'lodash'
  import {Chrome as colorPicker,} from 'vue-color'
  import parse from '../../shared/usercss-parser'
  import raven from 'raven-js'

  import oucFooter from '../elements/ouc-footer.vue'
  import navbar from '../elements/navbar.vue'
  import icon from '../elements/icon.vue'
  import notification from '../elements/notification.vue'
  import editor from '../elements/editor.vue'
  import listCreator from '../elements/list-creator.vue'

  import bInput from '../bits/b-input.vue'
  import bTextarea from '../bits/b-textarea.vue'
  import bSwitch from '../bits/b-switch.vue'

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
      noSSR,
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
  div.ouc-route-root
    .container
      .section
        notification(v-if="errors.all().length > 0", icon="alert", color="is-danger").is-danger
          div(slot="content")
            p(v-for="error in errors.all()") {{error}}

        form(slot="form", @submit.prevent="submit").ouc-new-theme-form
          .tile.ouc-new-theme-header.is-parent.is-paddingless
            .tile.is-6.is-child
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

            .tile.is-6.is-child
              button.button.is-pulled-right(
                type="submit",
                is-primary,
                :class="['button', 'is-primary', {'is-loading': loading}]"
              ) Save theme

          br
          .columns.is-multiline
            .column.is-12
              .columns
                .column.is-6
                  .field
                    .control
                      b-textarea(
                        type="text",
                        name="description",
                        placeholder="Theme description",
                        v-validate.disable="'required'",
                        v-model="editedTheme.description",
                        :class="['input', {'is-danger': errors.has('description')}]"
                      )
                .column.is-6
                  .box.is-fullheight
                    .content
                      vue-markdown(
                        :source="editedTheme.description",
                        :html="false",
                        :anchor-attributes="anchorAttributes"
                      )

            .column.is-7
              .tile.is-parent.is-paddingless.is-vertical
                .tile.is-child
                  .field
                    .control.has-icons-left
                      icon(icon="update")
                      b-input(
                        type="text",
                        name="version",
                        placeholder="Version",
                        v-validate.disable="'required|semver'",
                        v-model="editedTheme.version",
                        :class="['input', {'is-danger': errors.has('version')}]"
                      )

                .tile.is-child
                  list-creator(
                    icon="earth",
                    :max-items="10",
                    item-name="screenshot",
                    v-model="editedTheme.screenshots",
                    placeholder="Paste a URL to your image here"
                  ).has-bottom-margin

                .tile.ouc-new-theme-editor.is-child
                  .box.is-paddingless
                    no-ssr
                      editor(
                        @input="parseUserCSS",
                        v-model="editedTheme.content",
                        name="content",
                        v-validate.disable="'required'",
                        :class="{'is-danger': errors.has('content')}"
                      )

            .column.is-5
              .tile.is-parent.is-vertical
                .tile
                  .tile.is-child.is-6
                    button.button.is-primary.is-fullwidth(
                      type="button",
                      @click="addOption('text')"
                    ) Add text option
                  .tileis-child.is-6
                    button.button.is-primary.is-fullwidth(
                      type="button",
                      @click="addOption('color')"
                    ) Add color option
                .tile
                  .tileis-child.is-6
                    button.button.is-primary.is-fullwidth(
                      type="button",
                      @click="addOption('checkbox')"
                    ) Add checkbox option
                  .tileis-child.is-6
                    button.button.is-primary.is-fullwidth(
                      type="button",
                      @click="addOption('select')"
                    ) Add dropdown option

                br
                .tile.is-parent.is-paddingless.is-vertical
                  .tile.is-child(v-for="(option, index) in editedTheme.options")
                    .box.is-fullwidth
                      .level.is-marginless
                        .level-left
                          p {{properCase(option.type)}} option
                        .level-right
                          button.button.is-danger(
                            type="button",
                            @click="removeOption(index)"
                          )
                            icon(icon="close")
                      br
                      .tile.is-parent.is-paddingless
                        .tile.is-child
                          b-input(
                            type="text",
                            :name="option.type + '-' + index + '-' + 'label'",
                            placeholder="Option label",
                            v-model="editedTheme.options[index].label"
                          )
                        .tile.is-child
                          b-input(
                            type="text",
                            :name="option.type + '-' + index + '-' + 'name'",
                            placeholder="Variable name",
                            v-model="editedTheme.options[index].name"
                          )
                        .tile.is-child(v-if="option.type === 'text'")
                          b-input(
                            type="text",
                            :name="option.type + '-' + index + '-' + 'value'",
                            placeholder="Default value",
                            v-model="editedTheme.options[index].value"
                          )
                        .tile.has-text-centered.is-child(v-if="option.type === 'checkbox'")
                          .select.is-fullwidth
                            select(v-model="editedTheme.options[index].value")
                              option(value="checked") Checked
                              option(value="unchecked") Unchecked

                      .tile.is-parent.is-paddingless.is-vertical(v-if="option.type === 'color'")
                        hr
                        .tile.is-child
                          p Default:
                        .tile.is-child
                          color-picker.is-fullwidth(
                            :value="createColorsObject(option.value)",
                            @input="(event) => updateColor(event, index)"
                          )

                      .tile.is-parent.is-paddingless.is-vertical(v-if="option.type === 'select'")
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
