
export function encode(str: string): string {
  const buffer = Array.from(Buffer.from(str))
  return buffer.map(n => n.toString(16)).join(' ')
}

export function decode(str: string): string {
  const arr = str.split(/\s+/)
  const buffer = arr.map(str => parseInt(str, 16))

  return Buffer.from(buffer).toString('utf-8')
}
