import * as utf8 from './utf8'

export function encode(str: string): string {
  const buffer = Array.from(Buffer.from(utf8.encode(str)))
  return buffer.map(n => n.toString(16)).join(' ')
}

export function decode(str: string): string {
  const arr = str.split(/\s+/)
  const buffer = arr.map(str => parseInt(str, 16))

  return utf8.decode(Buffer.from(buffer).toString('utf-8'))
}
