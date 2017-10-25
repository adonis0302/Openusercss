import path from 'path'

export default {
  'head': {
    'title': 'OpenUserCss',
    'meta':  [
      {
        'charset': 'utf-8'
      },
      {
        'name':    'viewport',
        'content': 'width=device-width, initial-scale=1'
      },
      {
        'hid':     'description',
        'content': 'Themes for your favourite websites, by people like you'
      }
    ],
    'link': [
      {
        'rel':  'icon',
        'type': 'image/x-icon',
        'href': 'favicon.ico'
      }
    ]
  },
  'router': {
    'linkActiveClass': 'active'
  },
  'srcDir': path.resolve('./build/webserver')
}
