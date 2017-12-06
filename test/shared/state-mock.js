export default {
  'actionErrors': [
    new Error('This is a test error')
  ],
  'loading': false,
  'session': {
    '__typename': 'Session',
    'token':      'kou7BueghaeHiehaetunahch8e',
    'user':       {
      '__typename': 'User',
      '_id':        '5a262a2c3835ee7627db2ef9'
    }
  },
  'users': [
    {
      '__typename': 'User',
      '_id':        '5a262a2c3835ee7627db2ef9',
      'lastSeen':   '2017-12-06T02:21:12.373Z',
      'username':   'decentm',
      'themes':     [
        {
          '__typename': 'Theme',
          '_id':        '5a275431707d23a322cff59f'
        }
      ]
    }
  ],
  'themes': [
    {
      '__typename': 'Theme',
      '_id':        '5a275431707d23a322cff59f',
      'rating':     0,
      'title':      'asd',
      'version':    '1.0.0',
      'user':       {
        '__typename': 'User',
        '_id':        '5a262a2c3835ee7627db2ef9'
      }
    }
  ]
}
