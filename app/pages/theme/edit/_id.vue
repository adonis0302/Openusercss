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
  import imageCarousel from '~/components/elements/image-carousel.vue'
  import progressiveImage from '~/components/bits/progressive-image.vue'

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
      progressiveImage,
      imageCarousel,
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

  .is-minheight-description {
    min-height: 10rem;
  }

  .has-brand-line-left {
    border-left: 5px #0005FF solid;
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

        form.ouc-new-theme-form(v-else, @submit.prevent="submit", @input="saveTemp")
          .card
            .card-header
              .level.is-fullwidth.box.is-shadowless
                .level-left
                  h5.card-header-title(v-if="$route.params.id") Editing {{theme.title}}
                  h5.card-header-title(v-else) Creating {{theme.title | placeholder('a new theme')}}
                .level-right
                  button.button.is-primary(
                    type="submit",
                    :class="{'is-loading': loading}"
                  ) Save theme

            .card-content
              .field
                label.label(for="theme-title-input") Theme title
                .control.has-icons-left
                  fa-icon.icon(icon="font")
                  input.input#theme-title-input(
                    type="text",
                    name="title",
                    v-validate.disable="'required'",
                    v-model="editingTheme.title",
                    :class="{'is-danger': errors.has('title')}"
                  )

              .field
                label.label(for="theme-description-input") Theme description
                .columns
                  .column.is-6
                    .control
                      textarea.textarea.input.is-minheight-description#theme-description-input(
                        type="text",
                        name="description",
                        v-validate.disable="'required'",
                        v-model="editingTheme.description",
                        :class="{'is-danger': errors.has('description')}"
                      )
                  .column.is-6
                    vue-markdown.box.is-minheight-description(
                      :source="editingTheme.description",
                      :html="false",
                      :anchor-attributes="$anchorAttributes"
                    )

              .field
                label.label(for="theme-version-input") Semantic theme version
                .control.has-icons-left
                  fa-icon.icon(icon="code-branch")
                  input.input#theme-version-input(
                    type="text",
                    name="version",
                    v-validate.disable="'required|semver'",
                    v-model="editingTheme.version",
                    :class="{'is-danger': errors.has('version')}"
                  )

              .field
                label.label(for="theme-screenshots-input") Screenshots
                .columns
                  .column.is-6
                    .control
                      list-creator.has-bottom-margin#theme-screenshots-input(
                        @input="saveTemp",
                        icon="globe",
                        :max-items="10",
                        item-name="screenshot",
                        v-model="editingTheme.screenshots",
                        placeholder="Paste a URL to your image here"
                      )
                  .column.is-6
                    image-carousel(
                      v-model="theme.screenshots"
                    )

              .notification.is-warning(v-if="editorWarning")
                fa-icon(icon="exclamation")
                | {{editorWarning}}

              .field
                label.label(for="theme-source-input") Source code
                .control
                  no-ssr
                    editor#theme-source-input(
                      v-if="fancyEditor",
                      @input="parseUserCSS",
                      @change="saveTemp",
                      v-model="editingTheme.content",
                      name="content",
                      v-validate.disable="'required'",
                      :class="{'is-danger': errors.has('content')}"
                    )
                    textarea.textarea.input#theme-source-input(
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

          br
          .card
            .card-header
              p.card-header-title
                | Variables
            .card-content
              .field.box.has-brand-line-left(v-for="option in editingTheme.options")
                .columns.is-multiline
                  .column.is-2
                    .control
                      label.label(:for="'option-control-type-' + option.name")
                        | Type
                      .select.is-fullwidth
                        select.is-fullwidth(:id="'option-control-type-' + option.name", v-model="option.type")
                          option color
                          option select
                          option checkbox
                          option text

                  .column.is-5
                    .control
                      label.label(:for="'option-control-label-' + option.name")
                        | Label
                      input.input(:id="'option-control-label-' + option.name", v-model="option.label")

                  .column.is-5
                    .control
                      label.label(:for="'option-control-name-' + option.name")
                        | Name
                      input.input(:id="'option-control-name-' + option.name", v-model="option.name")

                  .column.is-6
                    .control
                      label.label(:for="'option-control-value-' + option.name")
                        | Value
                      input.input(:id="'option-control-value-' + option.name", v-model="option.value")

                  .column.is-6
                    .control
                      label.label(:for="'option-control-default-' + option.name")
                        | Default
                      input.input(:id="'option-control-default-' + option.name", v-model="option.default")

                  .column.is-12
                    .control
                      label.label(:for="'option-control-options-' + option.name")
                        | Options
                      list-creator(
                        v-model="option.options",
                        icon="clipboard-list",
                        :max-items="20",
                        item-name="option",
                        placeholder="Write your option here",
                        :support-objects="true"
                      )

    ouc-footer
</template>
