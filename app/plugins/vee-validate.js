import Vue from 'vue'
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate, {
  'errorBagName':  'errors',
  'fieldsBagName': 'vee-fields',
  'delay':         0,
  'locale':        'en',
  'dictionary':    null,
  'classes':       true,
  'strict':        true,
  'events':        'input|blur',
  'inject':        true,
  'validity':      false,
  'aria':          true,
})
