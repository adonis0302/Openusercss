<script>
  import bInput from '../bits/b-input.vue'

  export default {
    'components': {
      bInput,
    },
    'props': [
      'itemName',
      'maxItems',
      'icon',
      'placeholder',
      'value',
      'supportObjects',
    ],
    data () {
      return {
        'list': this.value,
      }
    },
    created () {
      this.list = this.value || []
    },
    'watch': {
      value (newValue) {
        this.list = newValue
      },
    },
    'computed': {
      listFull () {
        if (!this.list) {
          this.list = []
        }

        return this.list.length >= this.maxItems
      },
    },
    'methods': {
      changeItem () {
        this.$emit('input', this.list)
      },
      addItem () {
        if (this.list.length < this.maxItems) {
          this.list.push('')
        }
        this.$emit('input', this.list)
      },
      addObject () {
        if (this.list.length < this.maxItems) {
          this.list.push({
            'name':  '',
            'label': '',
            'value': '',
          })
        }
        this.$emit('input', this.list)
      },
      removeItem (index) {
        this.list.splice(index, 1)
        this.$emit('input', this.list)
      },
    },
  }
</script>

<template lang="pug">
  div.ouc-list-creator-wrapper
    div(v-for="(item, index) in list")
      .columns.is-mobile(v-if="typeof item === 'string'")
        .column.is-11
          .control.has-icons-left
            fa-icon.icon(:icon="icon")
            input.input(
              v-model="list[index]",
              @input="changeItem",
              :placeholder="placeholder"
            )

        .column.is-1
          button.button.is-pulled-right.is-danger(@click="removeItem(index)", type="button")
            fa-icon(icon="times")

      .columns.is-mobile(v-if="typeof item === 'object' && supportObjects")
        .column.is-11
          .columns
            .column(v-for="(value, key) in item", v-if="key !== '__typename'")
              .control.has-icons-left
                fa-icon.icon(:icon="icon")
                input.input(
                  v-model="list[index][key]",
                  @input="changeItem",
                  :placeholder="key"
                )

        .column.is-1
          button.button.is-pulled-right.is-danger(@click="removeItem(index)", type="button")
            fa-icon(icon="times")

    br
    .ouc-list-creator-object-item(v-if="supportObjects")
      button.button.is-primary(v-if="!listFull", @click="addObject", type="button") Add object {{itemName}}

    .tile.ouc-list-creator-array-item.is-parent.is-paddingless(v-else)
      .tile.is-child
        button.button.is-primary(v-if="!listFull", @click="addItem", type="button") Add {{itemName}}
</template>
