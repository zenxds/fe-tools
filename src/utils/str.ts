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
