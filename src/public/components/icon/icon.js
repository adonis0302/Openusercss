export default {
  'props': {
    'icon': {
      'type':    String,
      'default': 'exclamation'
    },
    'size': {
      'type':    String,
      'default': '18'
    }
  },
  'methods': {
    'classValue': (iconName, size) => {
      return `mdi-${iconName} mdi-${size}px`
    }
  }
}
