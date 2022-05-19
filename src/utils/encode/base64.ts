import * as utf8 from './utf8'

export const encode = (str: string) => btoa(utf8.encode(str))
export const decode = (str: string) => utf8.decode(atob(str))

export function encodeSVG(str: string): string {
  if (str.indexOf('xmlns') === -1) {
    str = str.replace(/<svg/, '<svg xmlns="http://www.w3.org/2000/svg"')
  }

  str = str
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/\s+/g, ' ')

  return `data:image/svg+xml,${str}`
}

export function decodeSVG(str: string): string {
  return str
    .replace('data:image/svg+xml,', '')
    .replace(/%3C/g, '<')
    .replace(/%3E/g, '>')
    .replace(/%7B/g, '{')
    .replace(/%7D/g, '}')
    .replace(/%25/g, '%')
    .replace(/%23/g, '#')
}
