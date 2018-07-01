import Vue from 'vue'

export const getRenderedText = (component, propsData) => {
  const Constructor = Vue.extend(component)
  const vm = new Constructor({
    propsData,
  }).$mount()

  return vm.$el.textContent
}
