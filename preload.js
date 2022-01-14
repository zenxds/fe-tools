function loadCss(url, callback) {
  const node = document.createElement('link')
  node.rel = 'stylesheet'
  node.href = url
  node.onload = callback
  document.head.appendChild(node)
}

function loadScript(url) {
  const node = document.createElement('script')
  node.async = true
  node.src = url
  document.head.appendChild(node)
}

window.addEventListener('DOMContentLoaded', () => {
  window.nodeRequire = require

  if (process.env.ELECTRON_ENV === 'development') {
    loadScript(
      'http://0.0.0.0:' + (process.env.WEBPACK_PORT || 9005) + '/main.js',
    )
  } else {
    loadCss('./dist/main.css', function () {
      loadScript('./dist/main.js')
    })
  }
})
