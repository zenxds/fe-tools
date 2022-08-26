import fs from 'fs'
import crypto from 'crypto'

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

export function sha1File(p: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const output = crypto.createHash('sha1')
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
