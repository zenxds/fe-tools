import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, Space, Button, message } from 'antd'
import { FormInstance } from 'antd/es/form'

import * as unicode from '@utils/encode/unicode'
import * as utf8 from '@utils/encode/utf8'
import * as base64 from '@utils/encode/base64'
import * as buffer from '@utils/encode/buffer'
import * as uri from '@utils/encode/uri'
import * as uriComponent from '@utils/encode/uriComponent'
import { formItemLayout, tailFormItemLayout } from '@constants'

interface IState {
  submitType: 'encode' | 'decode'
}

interface IValues {
  input: string
}

interface EncodeObject {
  encode: (str: string) => string
  decode: (str: string) => string
}

const encodeMethods: Record<EncodeCommon.EncodeTypes, EncodeObject> = {
  utf8: {
    encode: (str: string): string => unicode.encode(utf8.encode(str)),
    decode: (str: string): string => utf8.decode(unicode.decode(str))
  },
  unicode,
  base64,
  uri,
  buffer,
  uriComponent
}

@inject('store', 'actions')
@observer
export default class PageForm extends Component<EncodeCommon.CommonProps & EncodeCommon.IParams> {
  formRef = React.createRef<FormInstance>()

  state: IState = {
    submitType: 'encode'
  }

  componentDidUpdate(prevProps: EncodeCommon.CommonProps & EncodeCommon.IParams): void {
    const { type } = this.props

    if (prevProps.type !== type) {
      this.formRef.current?.resetFields()
    }
  }

  handleSubmit(type: 'encode' | 'decode'): void {
    this.setState({ submitType: type }, () => {
      this.formRef.current?.submit()
    })
  }

  handleFinish = (values: IValues): void => {
    const { submitType } = this.state
    const { type } = this.props

    try {
      const output = encodeMethods[type][submitType](values.input)
      this.formRef.current?.setFieldsValue({ output })
    } catch(err) {
      message.error(err.message)
    }
  }

  render(): ReactElement {
    return (
      <Form ref={this.formRef} {...formItemLayout} onFinish={this.handleFinish}>
        <Form.Item label="输入" name="input" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="输出" name="output">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button
              type="primary"
              onClick={this.handleSubmit.bind(this, 'encode')}
            >
              编码
            </Button>
            <Button
              type="primary"
              onClick={this.handleSubmit.bind(this, 'decode')}
            >
              解码
            </Button>
          </Space>
        </Form.Item>
      </Form>
    )
  }
}
