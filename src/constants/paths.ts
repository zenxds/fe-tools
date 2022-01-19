const paths = {
  compressImage: '/compress/image',

  cryptoMd5: '/crypto/md5',
  cryptoSha1: '/crypto/sha1',

  encodeUtf8: '/encode/utf8',
  encodeBase64: '/encode/base64',
  encodeUri: '/encode/uri',
  encodeUriComponent: '/encode/uriComponent',
  encodeFile: '/encode/file',

  randomStr: '/random/str',
  randomNumber: '/random/number',

  formatColor: '/format/color',
  formatTime: '/format/time',
  formatNumber: '/format/number',
  formatVarName: '/format/varName',

  ocr: '/other/ocr',
  uaParser: '/other/uaParser',
  qrcode: '/other/qrcode',
}

export const commonPaths = {
  encode: '/encode/:type',
  crypto: '/crypto/:type',
}

export default paths
export type PathKeys = keyof typeof paths
