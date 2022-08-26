import { ipcRenderer, clipboard } from 'electron'
import { isMac, isWin } from './system'

export async function setProxy(proxy: string): Promise<void> {
  ipcRenderer.send('setProxy', proxy)

  return new Promise(resolve => {
    ipcRenderer.once('proxyChanged', () => {
      console.log('proxyChanged', proxy)
      resolve()
    })
  })
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

export function getSaveDirectory(defaultPath?: string): string {
  const options: any = {
    title: '保存目录',
    message: '保存目录',
    properties: ['openDirectory', 'createDirectory'],
  }

  if (defaultPath) {
    options.defaultPath = defaultPath
  }

  const savePaths = ipcRenderer.sendSync('showOpenDialog', options)
  return savePaths ? savePaths[0] : ''
}

export function getSavePath(defaultPath?: string): string {
  const options: any = {
    properties: [],
  }

  if (defaultPath) {
    options.defaultPath = defaultPath
  }

  return ipcRenderer.sendSync('showSaveDialog', options)
}

