import crypto from 'crypto'
import { clipboard } from 'electron'
import { isMac, isWin } from './system'

export * from './cfb'

export function randomStr(length: number): string {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  let str = ''
  for (let i = 0; i < length; i++) {
    str += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return str
}

export function randomColor(): string {
  return (
    '#' +
    Math.floor(Math.random() * 0x1000000)
      .toString(16)
      .padStart(6, '0')
  )
}

export function randomNum(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

export function sha1(str: string): string {
  const hash = crypto.createHash('sha1')
  hash.update(str)
  return hash.digest('hex')
}

export function md5(str: string): string {
  const hash = crypto.createHash('md5')
  hash.update(str)
  return hash.digest('hex')
}

export function underscored(str: string): string {
  return str.replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase()
}

export function hyphened(str: string): string {
  return str
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
}

export function camelCase(str: string, isBig?: boolean): string {
  const ret = str.replace(/[-_][^-_]/g, function(match) {
    return match.charAt(1).toUpperCase()
  })

  return (isBig ? ret.charAt(0).toUpperCase() : ret.charAt(0).toLowerCase()) + ret.slice(1)
}

export function stringToRegExp(str: string): RegExp {
  const match = str.match(/^\/(.*?)\/([dgimsuy]*)$/)
  return match ? new RegExp(match[1], match[2]) : new RegExp(str)
}

// https://github.com/electron/electron/issues/9035#issuecomment-722163818
export function getClipboardFilePath(): string {
  if (isMac) {
    return decodeURIComponent(clipboard.read('public.file-url').replace('file://', ''))
  }

  if (isWin) {
    return clipboard.readBuffer('FileNameW').toString('ucs2').replace(RegExp(String.fromCharCode(0), 'g'), '')
  }

  return ''
}

interface ParseDataURIResult {
  mime: string
  ext: string
  data: string
}

export function parseDataURI(input: string): ParseDataURIResult {
  const match = /^data:(\w+\/[\w-+.]+)(?=[;])/.exec(input.split(',')[0])
  const mime = match ? match[1] : 'image/png'

  return {
    mime,
    ext: mime.split('/')[1],
    data: input.split(',')[1],
  }
}
