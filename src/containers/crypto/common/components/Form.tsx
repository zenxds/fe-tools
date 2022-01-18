import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, Button } from 'antd'
import { FormInstance } from 'antd/es/form'

import { sha1, md5 } from '@utils'
import { formItemLayout, tailFormItemLayout } from '@constants'

interface IValues {
  input: string
}

const cryptoMethods: Record<CryptoCommon.CryptoTypes, (str: string) => string> = {
  md5,
  sha1
}

@inject('store', 'actions')
@observer
export default class PageForm extends Component<CryptoCommon.CommonProps & CryptoCommon.IParams> {
  formRef = React.createRef<FormInstance>()

  componentDidUpdate(prevProps: CryptoCommon.CommonProps & CryptoCommon.IParams): void {
    const { type } = this.props

    if (prevProps.type !== type) {
      this.formRef.current?.resetFields()
    }
  }

  handleFinish = (values: IValues): void => {
    const { type } = this.props
    const output = cryptoMethods[type](values.input)
    this.formRef.current?.setFieldsValue({ output })
  }

  render(): ReactElement {
    return (
      <Form ref={this.formRef} {...formItemLayout} onFinish={this.handleFinish}>
        <Form.Item label="字符串" name="input" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="输出" name="output">
          <Input.TextArea rows={5} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    )
  }
}
