export default {
  'actionErrors': [
    new Error('This is a test error')
  ],
  'loading': false,
  'session': {
    '_schema':    {},
    '__typename': 'Session',
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
      'content':     'body {\n  content: \"yaeee\"\;\n}',
      'description': 'test description',
      'user':        {
        '_schema':    {},
        '__typename': 'User',
        '_id':        '5a262a2c3835ee7627db2ef9'
      }
    }
  ]
}
