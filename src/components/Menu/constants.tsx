import paths from '@constants/paths'

export interface MenuItem {
  name: string
  code: string
  children: MenuItem[]
}

export const menus: MenuItem[] = [
  {
    name: '图片',
    code: 'image',
    children: [
      {
        name: '压缩',
        code: paths.imageCompress,
        children: []
      },
      {
        name: '裁切',
        code: paths.imageSlice,
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
      // 不常用
      // {
      //   name: 'URI',
      //   code: paths.encodeUri,
      //   children: []
      // },
      // {
      //   name: 'URIComponent',
      //   code: paths.encodeUriComponent,
      //   children: []
      // },
      {
        name: 'Unicode',
        code: paths.encodeUnicode,
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
      {
        name: 'Buffer',
        code: paths.encodeBuffer,
        children: []
      }
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
        name: 'URL解析',
        code: paths.urlParser,
        children: []
      },
      {
        name: 'OCR',
        code: paths.ocr,
        children: []
      },
      {
        name: '二维码生成',
        code: paths.qrcode,
        children: []
      },
      {
        name: '文件下载',
        code: paths.download,
        children: []
      },
      {
        name: '测试连接',
        code: paths.connectTest,
        children: []
      }
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
