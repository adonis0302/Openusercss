export default () => {
  let prefix = 'https://'

  if (process.env.NODE_ENV === 'development') {
    prefix = 'http://'
  }

  if (process.server) {
    return 'http://localhost:5000'
  }

  return `${prefix}api.${location.host}`
}
