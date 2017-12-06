module.exports = {
  'extends': [
    '@commitlint/config-conventional'
  ],
  'rules': {
    'type-case': ['lower-case'],
    'scope-case': ['lower-case'],
    'subject-case': ['sentence-case']
  }
}
