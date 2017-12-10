export default {
  'actionErrors': [
    new Error('This is a test error')
  ],
  'loading': false,
  'session': {
    '_schema':    {},
    '__typename': 'Session',
    'ip':         '172.16.44.23',
    'ua':         'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
    'token':      'kou7BueghaeHiehaetunahch8e',
    'user':       {
      '_schema':    {},
      '__typename': 'User',
      '_id':        '5a262a2c3835ee7627db2ef9'
    }
  },
  'users': [
    {
      '_schema':    {},
      '__typename': 'User',
      '_id':        '5a262a2c3835ee7627db2ef9',
      'lastSeen':   '2017-12-06T02:21:12.373Z',
      'username':   'decentm',
      'themes':     [
        {
          '_schema':    {},
          '__typename': 'Theme',
          '_id':        '5a275431707d23a322cff59f'
        }
      ]
    }
  ],
  'themes': [
    {
      '_schema':     {},
      '__typename':  'Theme',
      '_id':         '5a275431707d23a322cff59f',
      'rating':      0,
      'title':       'asd',
      'version':     '1.0.0',
      'content':     '@-moz-document regexp(".*openusercss.org.*") {body {content: "yaeee";}}',
      'description': 'test description',
      'user':        {
        '_schema':    {},
        '__typename': 'User',
        '_id':        '5a262a2c3835ee7627db2ef9'
      }
    }
  ]
}
