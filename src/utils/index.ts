import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { clipboard } from 'electron'
import mime from 'mime'
import { Canvg } from 'canvg'
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

export function md5File(p: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const output = crypto.createHash('md5')
    const input = fs.createReadStream(p)

    input.on('error', err => {
      reject(err)
    })

    output.once('readable', () => {
      resolve(output.read().toString('hex'))
    })

    input.pipe(output)
  })
}

export function underscored(str: string): string {
  return str
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .replace(/-/g, '_')
    .toLowerCase()
}

export function hyphened(str: string): string {
  return str
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
}

export function camelCase(str: string, isBig?: boolean): string {
  const ret = underscored(str).replace(/[-_][^-_]/g, function (match) {
    return match.charAt(1).toUpperCase()
  })

  return (
    (isBig ? ret.charAt(0).toUpperCase() : ret.charAt(0).toLowerCase()) +
    ret.slice(1)
  )
}

export function stringToRegExp(str: string): RegExp {
  const match = str.match(/^\/(.*?)\/([dgimsuy]*)$/)
  return match ? new RegExp(match[1], match[2]) : new RegExp(str)
}

// https://github.com/electron/electron/issues/9035#issuecomment-722163818
export function getClipboardFilePath(): string {
  if (isMac) {
    return decodeURIComponent(
      clipboard.read('public.file-url').replace('file://', ''),
    )
  }

  if (isWin) {
    return clipboard
      .readBuffer('FileNameW')
      .toString('ucs2')
      .replace(RegExp(String.fromCharCode(0), 'g'), '')
  }

  return ''
}

interface ParseDataURIResult {
  mime: string
  ext: string
  data: string
}

export function parseDataURI(input: string): ParseDataURIResult {
  const arr = input.split(',')
  // /^data:(\w+\/[\w-+.]+)(;charset=[\w-]+|;base64){0,1},(.*)/
  const match = /^data:(\w+\/[\w-+.]+)(;charset=[\w-]+|;base64){0,1},/.exec(
    arr[0] + ',',
  )
  const type = match ? match[1] : 'image/png'

  return {
    mime: type,
    ext: mime.getExtension(type) || '',
    data: arr[1],
  }
}

export function toPNG(str: string): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (ctx) {
    const v = Canvg.fromString(ctx, str)
    v.start()
  }

  return canvas.toDataURL('img/png')
}

interface ParsePathResult {
  dirname: string
  basename: string
  extname: string
  filename: string
}

export const parsePath = (url: string): ParsePathResult => {
  // 支持url链接
  const input = url ? url.split('?')[0] : ''
  const extname = path.extname(input)

  return {
    dirname: path.dirname(input),
    basename: path.basename(input),
    extname,
    filename: path.basename(input, extname),
  }
}

export const substitute = (
  str = '',
  o: Record<string, number | string>,
): string => {
  return str.replace(
    /\\?\{\{\s*([^{}\s]+)\s*\}\}/g,
    function (match, name): string {
      if (match.charAt(0) === '\\') {
        return match.slice(1)
      }
      return o[name] == null ? '' : `${o[name]}`
    },
  )
}
