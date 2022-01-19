import * as tencentcloud from 'tencentcloud-sdk-nodejs-ocr'
import { Client } from 'tencentcloud-sdk-nodejs-ocr/tencentcloud/services/ocr/v20181119/ocr_client'

const OCRClient = tencentcloud.ocr.v20181119.Client

interface OCR_ITEM {
  text: string
  column: number
  row: number
}

interface OCROptions {
  secretId: string
  secretKey: string
}

export default class OCRParser {
  public options: OCROptions
  public client: Client

  public constructor(options?: OCROptions) {
    this.options = options || {
      secretId: '',
      secretKey: '',
    }

    const clientConfig = {
      // 腾讯云认证信息
      credential: {
        secretId: this.options.secretId,
        secretKey: this.options.secretKey,
      },
      // 产品地域
      region: 'ap-shanghai',
      // 可选配置实例
      profile: {
        httpProfile: {
          endpoint: 'ocr.tencentcloudapi.com',
        },
      },
    }
    this.client = new OCRClient(clientConfig)
  }

  public async parse(image: string): Promise<OCR_ITEM[]> {
    const params = {
      ImageBase64: image,
    }
    const result = await this.client.RecognizeTableOCR(params)
    const ret: OCR_ITEM[] = []

    result.TableDetections.forEach(item => {
      item.Cells.forEach(cell => {
        const text = cell.Text.replace(/\s+/g, '')
        if (text) {
          ret.push({
            text: cell.Text.replace(/\s+/g, ''),
            column: cell.ColTl,
            row: cell.RowTl,
          })
        }
      })
    })

    return ret
  }
}
