import fs from 'fs'
import path from 'path'
import { ipcRenderer } from 'electron'

interface StoreOptions {
  name: string
}

const userDataPath = ipcRenderer.sendSync('getPath', 'userData')

export default class FileStore {
  public options: StoreOptions
  public path: string
  private cache: Record<string, string | number>

  constructor(options: StoreOptions) {
    this.options = options

    this.path = path.join(userDataPath, options.name + '.json')
    this.cache = this.getFileContent(this.path)
  }

  getFileContent(file: string): Record<string, string> {
    if (fs.existsSync(file)) {
      return nodeRequire(file)
    }

    return {}
  }

  save() {
    const { path, cache } = this
    fs.writeFileSync(path, JSON.stringify(cache, null, 2))
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
