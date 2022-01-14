import {
  execSync as _execSync,
  ExecSyncOptionsWithStringEncoding
} from 'child_process'

export function execSync(
  cmd: string,
  options?: ExecSyncOptionsWithStringEncoding
): string {
  return _execSync(cmd, Object.assign(
    {
      encoding: 'utf8'
    },
    options || {}
  ) as ExecSyncOptionsWithStringEncoding)
}

export const isMac = process.platform === 'darwin'
export const isWin = process.platform === 'win32'
