<script>
  import bInput from '../bits/b-input.vue'
  import icon from './icon.vue'

  export default {
    'components': {
      bInput,
      icon,
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
    .tile.ouc-list-creator-item.has-bottom-margin(v-for="(item, index) in list", is-parent, is-vertical, is-paddingless)
      .tile
        .tile(is-child, is-11)
          .control(v-if="typeof item === 'string'", has-icons-left)
            icon(:icon="icon")
            b-input(
              v-model="list[index]",
              @input="changeItem",
              :placeholder="placeholder"
            )
          .tile(v-if="typeof item === 'object' && supportObjects")
            .control(v-for="(value, key) in item", v-if="key !== '__typename'", has-icons-left)
              icon(:icon="icon")
              b-input(
                v-model="list[index][key]",
                @input="changeItem"
              )
        .tile(is-child, is-1)
          button.button.is-pulled-right.is-danger(@click="removeItem(index)", type="button") X
    .tile.ouc-list-creator-object-item(v-if="supportObjects", is-parent, is-paddingless)
      .tile(is-child)
        button.button.is-primary(v-if="!listFull", @click="addItem", type="button") Add string {{itemName}}
      .tile(is-child)
        button.button.is-primary(v-if="!listFull", @click="addObject", type="button") Add object {{itemName}}

    .tile.ouc-list-creator-array-item(v-if="!supportObjects", is-parent, is-paddingless)
      .tile(is-child)
        button.button.is-primary(v-if="!listFull", @click="addItem", type="button") Add {{itemName}}
</template>
