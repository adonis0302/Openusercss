if (typeof window !== 'undefined') {
  window._paq = window._paq || []

  window._paq.push(['setDoNotTrack', true,])
  window._paq.push([ 'disableCookies', ])
}

export const initMatomo = () => new Promise((resolve, reject) => {
  if (typeof window === 'undefined' || !process.browser) {
    throw new Error('Matomo must only run in browsers')
  }

  const u = '//pwk.decentm.com/'

  window._paq.push(['setTrackerUrl', `${u}piwik.php`,])
  window._paq.push(['setSiteId', '10',])
  const d = document
  const g = d.createElement('script')
  const s = d.getElementsByTagName('script')[0]

  g.type = 'text/javascript'
  g.async = true
  g.defer = true
  g.src = `${u}piwik.js`
  s.parentNode.insertBefore(g, s)
  g.onload = resolve(window._paq)
})
