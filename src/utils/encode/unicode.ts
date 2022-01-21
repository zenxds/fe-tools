// from uglify
export function encode(str: string): string {
  return str.replace(/[\u0080-\uffff]/g, function(ch) {
    let code = ch.charCodeAt(0).toString(16)

    if (code.length <= 2) {
      while (code.length < 2) {
        code = '0' + code
      }
      return '\\x' + code
    } else {
      while (code.length < 4) {
        code = '0' + code
      }
      return '\\u' + code
    }
  })
}

export function decode(str: string): string {
  return str
    .replace(/\\u[a-zA-Z0-9]{4}/g, function(ch: string) {
      return String.fromCharCode(parseInt(ch.substr(2), 16))
    })
    .replace(/\\x[a-zA-Z0-9]{2}/g, function(ch: string) {
      return String.fromCharCode(parseInt(ch.slice(2), 16))
    })
}
