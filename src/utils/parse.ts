import path from 'path'
import mime from 'mime'
import { Canvg } from 'canvg'

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

export function parseLines(input: string): string[] {
  const ret: string[] = []
  input.split('\n').forEach((line: string): void => {
    const val = line.trim()
    if (val) {
      ret.push(val)
    }
  })

  return ret
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
