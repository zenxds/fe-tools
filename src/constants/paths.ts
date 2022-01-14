const paths = {
  compressImage: '/compress/image',
  cryptoMd5: '/crypto/md5',
  cryptoSha1: '/crypto/sha1',
  encodeUtf8: '/encode/utf8',
  encodeBase64: '/encode/base64',
  encodeFile: '/encode/file',
  randomStr: '/random/str',
  randomColor: '/random/color',
  randomNum: '/random/num',
}

export default paths
export type PathKeys = keyof typeof paths
