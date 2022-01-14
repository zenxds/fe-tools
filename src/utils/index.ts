import crypto from 'crypto'

export * from './cfb'

export function randomStr(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

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
