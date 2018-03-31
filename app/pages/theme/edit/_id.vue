<script>
  import semver from 'semver'
  import {cloneDeep, concat,} from 'lodash'
  import {Chrome as colorPicker,} from 'vue-color'
  import {parse,} from 'parse-usercss'
  import raven from 'raven-js'
  import {mapGetters,} from 'vuex'

  import oucFooter from '~/components/elements/ouc-footer.vue'
  import navbar from '~/components/elements/navbar.vue'
  import notification from '~/components/elements/notification.vue'
  import editor from '~/components/elements/editor.vue'
  import listCreator from '~/components/elements/list-creator.vue'

  import bInput from '~/components/bits/b-input.vue'
  import bTextarea from '~/components/bits/b-textarea.vue'
  import bSwitch from '~/components/bits/b-switch.vue'

  const customDictionary = {
    'en': {
      'custom': {
        'content': {
          'required': 'Theme code must not be empty',
        },
        'version': {
          'semver': 'Theme versioning must be semantic (e.g.: 1.0.0)',
        },
      },
    },
  }

  export default {
    'components': {
      oucFooter,
      navbar,
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
        'error':         null,
        'editorWarning': null,
        'fancyEditor':   'on',
        'notFound':      false,
        'editingTheme':  {
          'id':          '',
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
    async asyncData ({route, store,}) {
      if (!route.params.id) {
        return null
      }

      try {
        await store.dispatch('themes/single', route.params.id)
      } catch (error) {
        return {
          'notFound': error.message,
        }
      }
    },
    created () {
      if (this.$route.params.id && !this.theme) {
        this.$store.commit('themes/editTemp', {
          'id':    this.$route.params.id,
          'theme': cloneDeep(this.editingTheme),
        })
      }

      this.$validator.extend('semver', (value) => !!semver.valid(value))
      this.$validator.localize(customDictionary)

      this.editingTheme = cloneDeep(this.$store.getters['themes/single'](this.$route.params.id))
        || this.editingTheme
    },
    mounted () {
      this.editingTheme = cloneDeep(this.$store.getters['themes/editCache'][this.$route.params.id])
        || this.editingTheme
    },
    'methods': {
      concat,
      saveTemp () {
        this.$store.commit('themes/editTemp', {
          'id':    this.$route.params.id,
          'theme': cloneDeep(this.editingTheme),
        })
      },
      async submit () {
        const validated = await this.$validator.validateAll()

        if (validated) {
          const readyTheme = cloneDeep(this.editingTheme)

          try {
            await this.$store.dispatch('themes/submit', readyTheme)
            this.$router.push('/')
          } catch (error) {
            this.$toast.error(error.message)
          }
        }
      },
      createColorsObject (hex) {
        return {
          hex,
        }
      },
      addOption (type) {
        this.editingTheme.options.push({
          type,
        })
      },
      removeOption (index) {
        this.editingTheme.options.splice(index, 1)
      },
      properCase (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      updateColor (colorObj, index) {
        this.editingTheme.options[index].value = colorObj.hex
      },
      renderObjectOption (obj) {
        if (typeof obj === 'string') {
          return obj
        }

        return `${obj.label} - ${obj.value}`
      },
      parseUserCSS (input) {
        this.$nextTick(() => {
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
              parseResult = parse(input)
              this.error = null
            } catch (error) {
              this.error = error
              raven.captureException(error)
            }

            if (!parseResult) {
              return null
            }

            const {
              description,
              name,
              vars,
              version,
            } = parseResult

            this.editingTheme.version = version
            this.editingTheme.description = description
            this.editingTheme.title = name

            this.editingTheme.options = []

            Object.keys(vars).forEach((key) => {
              const item = cloneDeep(vars[key])

              this.editingTheme.options.push(item)
            })

            this.editorWarning = [
              'Don\'t forget to remove the usercss definition',
              'from the theme before saving',
            ].join(' ')
          } else {
            this.editorWarning = null
          }
        })
      },
    },
    'computed': {
      ...mapGetters({
        'loading': 'themes/loading',
      }),
      theme () {
        return this.$store.getters['themes/editCache'][this.$route.params.id] || this.editingTheme
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../../scss/autocolor';
  @import '../../../scss/variables';

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
        .notification(v-if="errors.all().length > 0", icon="exclamation", color="is-danger").is-danger
          div(slot="content")
            p(v-for="error in errors.all()") {{error}}
        .notification.is-danger(v-if="error")
          p An error occurred in the editor: {{error.message}}
        .notification.is-danger(v-if="notFound")
          p An error occurred while loading the editor: {{notFound}}

        form(v-else, slot="form", @submit.prevent="submit", @input="saveTemp").ouc-new-theme-form
          .tile.ouc-new-theme-header.is-parent.is-paddingless
            .tile.is-6.is-child
              h1.is-inline(v-if="$route.params.id") Editing:&nbsp;
              h1.is-inline(v-else="$route.params.id") Creating:&nbsp;
              b-input.is-inline.is-size-7(
                type="text",
                name="title",
                placeholder="Theme title",
                v-validate.disable="'required'",
                v-model="editingTheme.title",
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
                        v-model="editingTheme.description",
                        :class="['input', {'is-danger': errors.has('description')}]"
                      )
                .column.is-6
                  .box.is-fullheight
                    .content
                      vue-markdown(
                        :source="editingTheme.description",
                        :html="false",
                        :anchor-attributes="$anchorAttributes"
                      )

            .column.is-7
              .tile.is-parent.is-paddingless.is-vertical
                .tile.is-child
                  .field
                    .control.has-icons-left
                      fa-icon.icon(icon="code-branch")
                      input.input(
                        type="text",
                        name="version",
                        placeholder="Version",
                        v-validate.disable="'required|semver'",
                        v-model="editingTheme.version",
                        :class="['input', {'is-danger': errors.has('version')}]"
                      )

                .tile.is-child
                  list-creator(
                    icon="globe",
                    :max-items="10",
                    item-name="screenshot",
                    v-model="editingTheme.screenshots",
                    placeholder="Paste a URL to your image here"
                    ).has-bottom-margin

                .notification.is-warning(v-if="editorWarning")
                  fa-icon(icon="exclamation")
                  | {{editorWarning}}

                .tile.is-child
                  label
                    | Use fancy code editor
                    b-switch.is-pulled-right(v-model="fancyEditor")

                .tile.ouc-new-theme-editor.is-child
                  no-ssr
                    .box.is-paddingless(v-if="fancyEditor")
                      editor(
                        @input="parseUserCSS",
                        @change="saveTemp",
                        v-model="editingTheme.content",
                        name="content",
                        v-validate.disable="'required'",
                        :class="{'is-danger': errors.has('content')}"
                      )
                    b-textarea(
                      v-else,
                      type="text",
                      name="content",
                      placeholder="Theme source code",
                      @input="parseUserCSS",
                      @change="saveTemp",
                      v-model="editingTheme.content",
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
                  .tile.is-child.is-6
                    button.button.is-primary.is-fullwidth(
                      type="button",
                      @click="addOption('color')"
                    ) Add color option
                .tile
                  .tile.is-child.is-6
                    button.button.is-primary.is-fullwidth(
                      type="button",
                      @click="addOption('checkbox')"
                    ) Add checkbox option
                  .tile.is-child.is-6
                    button.button.is-primary.is-fullwidth(
                      type="button",
                      @click="addOption('select')"
                    ) Add dropdown option

                br
                .tile.is-parent.is-paddingless.is-vertical
                  .tile.is-child(v-for="(option, index) in editingTheme.options")
                    .box.is-fullwidth
                      .level.is-marginless
                        .level-left
                          p {{properCase(option.type)}} option
                        .level-right
                          button.button.is-danger(
                            type="button",
                            @click="removeOption(index)"
                          )
                            fa-icon(icon="times")
                      br
                      .tile.is-parent.is-paddingless
                        .tile.is-child
                          input.input(
                            type="text",
                            :name="option.type + '-' + index + '-' + 'label'",
                            placeholder="Option label",
                            v-model="editingTheme.options[index].label"
                          )
                        .tile.is-child
                          input.input(
                            type="text",
                            :name="option.type + '-' + index + '-' + 'name'",
                            placeholder="Variable name",
                            v-model="editingTheme.options[index].name"
                          )
                        .tile.is-child(v-if="option.type === 'text'")
                          input.input(
                            type="text",
                            :name="option.type + '-' + index + '-' + 'value'",
                            placeholder="Default value",
                            v-model="editingTheme.options[index].default"
                          )
                        .tile.has-text-centered.is-child(v-if="option.type === 'checkbox'")
                          .select.is-fullwidth
                            select(v-model="editingTheme.options[index].value")
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
                          v-model="editingTheme.options[index].options",
                          item-name="value option",
                          max-items=64,
                          placeholder="Value",
                          icon="bars",
                          :support-objects="true"
                        )

    ouc-footer
</template>
