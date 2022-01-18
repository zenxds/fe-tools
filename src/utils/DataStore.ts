import fs from 'fs'
import path from 'path'
import { encrypt, decrypt } from './cfb'
import { ipcRenderer } from 'electron'

interface StoreOptions {
  name: string
  password: string
  iv: string
}

const userDataPath = ipcRenderer.sendSync('getPath', 'userData')

export default class FileStore {
  public options: StoreOptions
  public file: string
  private cache: Record<string, string | number>
  private password: string
  private iv: string

  constructor(options: StoreOptions) {
    this.options = options
    this.password = options.password
    this.iv = options.iv
    this.file = path.join(userDataPath, options.name)
    this.cache = this.load()
  }

  load(): Record<string, string> {
    const { file } = this
    if (fs.existsSync(file)) {
      const buffer = fs.readFileSync(file)
      try {
        return JSON.parse(decrypt(buffer, this.password, this.iv).toString('utf8'))
      } catch(err) {
        return {}
      }
    }

    return {}
  }

  save() {
    const { file, cache } = this
    const buffer = Buffer.from(JSON.stringify(cache))
    fs.writeFileSync(file, encrypt(buffer, this.password, this.iv))
  }

  get(key: string) {
    return this.cache[key]
  }

  set(key: string, value: string | number) {
    this.cache[key] = value
    this.save()
  }

  remove(key: string) {
    delete this.cache[key]
    this.save()
  }
}

