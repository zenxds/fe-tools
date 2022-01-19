import paths from '@constants/paths'

export interface MenuItem {
  name: string
  code: string
  children: MenuItem[]
}

export const menus: MenuItem[] = [
  {
    name: '压缩',
    code: 'compress',
    children: [
      {
        name: '图片',
        code: paths.compressImage,
        children: []
      }
    ]
  },
  {
    name: '编解码',
    code: 'encode',
    children: [
      {
        name: 'Base64',
        code: paths.encodeBase64,
        children: []
      },
      {
        name: 'URI',
        code: paths.encodeUri,
        children: []
      },
      {
        name: 'URIComponent',
        code: paths.encodeUriComponent,
        children: []
      },
      {
        name: 'UTF8',
        code: paths.encodeUtf8,
        children: []
      },
      {
        name: 'DataURI',
        code: paths.encodeFile,
        children: []
      },
    ]
  },
  {
    name: '加密',
    code: 'crypto',
    children: [
      {
        name: 'MD5',
        code: paths.cryptoMd5,
        children: []
      },
      {
        name: 'SHA1',
        code: paths.cryptoSha1,
        children: []
      }
    ]
  },
  {
    name: '随机',
    code: 'random',
    children: [
      {
        name: '字符串',
        code: paths.randomStr,
        children: []
      },
      {
        name: '数字',
        code: paths.randomNumber,
        children: []
      }
    ]
  },
  {
    name: '格式转换',
    code: 'format',
    children: [
      {
        name: '时间',
        code: paths.formatTime,
        children: []
      },
      {
        name: '数字',
        code: paths.formatNumber,
        children: []
      },
      {
        name: '颜色',
        code: paths.formatColor,
        children: []
      },
      {
        name: '变量名',
        code: paths.formatVarName,
        children: []
      }
    ]
  },
  {
    name: '其他',
    code: 'other',
    children: [
      {
        name: 'UA解析',
        code: paths.uaParser,
        children: []
      },
      {
        name: 'OCR',
        code: paths.ocr,
        children: []
      },
    ]
  }
]

export const pathMap = new Map<string, MenuItem>()
export const parentMap = new Map<string, string>()

function getPathMap(menus: MenuItem[], map: Map<string, MenuItem>): void {
  menus.forEach(menu => {
    if (menu.children.length > 0) {
      getPathMap(menu.children, map)
    }

    map.set(menu.code, menu)
  })
}

function getParentMap(menus: MenuItem[], map: Map<string, string>, parentCode?: string): void {
  menus.forEach(menu => {
    if (menu.children.length > 0) {
      getParentMap(menu.children, map, menu.code)
    }

    if (parentCode) {
      parentMap.set(menu.code, parentCode)
    }
  })
}

getPathMap(menus, pathMap)
getParentMap(menus, parentMap)
