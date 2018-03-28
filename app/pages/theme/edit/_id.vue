<script>
  import semver from 'semver'
  import {cloneDeep, concat,} from 'lodash'
  import {Chrome as colorPicker,} from 'vue-color'
  import parse from '~/../lib/usercss-parser'
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
        'editingTheme': {
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
    fetch ({route, store,}) {
      return store.dispatch('themes/single', route.params.id)
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

          await this.$store.dispatch('themes/submit', readyTheme)
          this.$router.push('/')
        }
      },
      /* createColorsObject (hex) {
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
      }, */
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

          this.editingTheme.content = code
          this.editingTheme.version = props.version
          this.editingTheme.description = props.description
          this.editingTheme.license = props.license
          this.editingTheme.title = props.title
          this.editingTheme.options = props.vars
        }
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
        notification(v-if="errors.all().length > 0", icon="exclamation", color="is-danger").is-danger
          div(slot="content")
            p(v-for="error in errors.all()") {{error}}

        form(slot="form", @submit.prevent="submit", @change="saveTemp").ouc-new-theme-form
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
                      b-input(
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

                .tile.ouc-new-theme-editor.is-child
                  .box.is-paddingless
                    no-ssr
                      editor(
                        @input="parseUserCSS",
                        @change="saveTemp",
                        v-model="editingTheme.content",
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
                            icon(icon="close")
                      br
                      .tile.is-parent.is-paddingless
                        .tile.is-child
                          b-input(
                            type="text",
                            :name="option.type + '-' + index + '-' + 'label'",
                            placeholder="Option label",
                            v-model="editingTheme.options[index].label"
                          )
                        .tile.is-child
                          b-input(
                            type="text",
                            :name="option.type + '-' + index + '-' + 'name'",
                            placeholder="Variable name",
                            v-model="editingTheme.options[index].name"
                          )
                        .tile.is-child(v-if="option.type === 'text'")
                          b-input(
                            type="text",
                            :name="option.type + '-' + index + '-' + 'value'",
                            placeholder="Default value",
                            v-model="editingTheme.options[index].value"
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
                          v-model="editingTheme.options[index].value",
                          item-name="value option",
                          max-items=64,
                          placeholder="Value",
                          icon="view-list",
                          :support-objects="true"
                        )

    ouc-footer
</template>
