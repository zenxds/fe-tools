import React, { Component, Fragment, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, Space, Button, InputNumber, message } from 'antd'
import { FormInstance } from 'antd/es/form'
import qrcode from 'qrcode'
import fs from 'fs'
import { clipboard, nativeImage, shell } from 'electron'

import { randomStr, parseDataURI, getSavePath } from '@utils'
import { formItemLayout, tailFormItemLayout } from '@constants'
import '../less/styles.less'

interface IState {
  result?: string
}

interface IValues {
  input: string
  margin: number
}

@inject('store', 'actions')
@observer
export default class PageForm extends Component<QRCode.CommonProps> {
  formRef = React.createRef<FormInstance>()

  state: IState = {}

  handleFinish = async(values: IValues): Promise<void> => {
    const result = await qrcode.toDataURL(values.input, {
      margin: values.margin,
    })
    this.setState({
      result
    })
  }

  handleCopy = (): void => {
    const { result } = this.state

    if (!result) {
      return
    }

    const img = nativeImage.createFromDataURL(result)
    clipboard.writeImage(img)
    message.success('复制成功')
  }

  handleSave = (): void => {
    const { result } = this.state

    if (!result) {
      return
    }

    const { data } = parseDataURI(result)
    const savePath = getSavePath(randomStr(32) + '.png')

    if (savePath) {
      fs.writeFileSync(savePath, data, 'base64')
      shell.showItemInFolder(savePath)
    }
  }

  render(): ReactElement {
    const { result } = this.state
    return (
      <Fragment>
        <Form ref={this.formRef} {...formItemLayout} initialValues={{ margin: 2 }}  onFinish={this.handleFinish}>
          <Form.Item label="输入" name="input" rules={[{ required: true }]}>
            <Input.TextArea rows={5} />
          </Form.Item>

          <Form.Item label="留白" name="margin" rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>

          {
            result && (
              <Form.Item label="二维码">
                <img styleName="qrcode" src={result} alt="二维码图片" />
              </Form.Item>
            )
          }

          <Form.Item {...tailFormItemLayout}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
              >
                生成
              </Button>
              {
                result && (
                  <Button
                    onClick={this.handleCopy}
                    type="default"
                  >
                    复制
                  </Button>
                )
              }
              {
                result && (
                  <Button
                    onClick={this.handleSave}
                    type="default"
                  >
                    保存
                  </Button>
                )
              }
            </Space>
          </Form.Item>
        </Form>
      </Fragment>
    )
  }
}
