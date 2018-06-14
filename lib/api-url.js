export default () => {
  let prefix = 'https://'

  if (process.env.NODE_ENV === 'development') {
    prefix = 'http://'
  }

  return `${prefix}api.${location.host}`
}
