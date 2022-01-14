import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, Button } from 'antd'
import { FormInstance } from 'antd/es/form'

import { sha1, md5 } from '@utils'
import { formItemLayout, tailFormItemLayout } from '@constants'

interface IValues {
  input: string
}

@inject('store', 'actions')
@observer
export default class PageForm extends Component<CryptoCommon.CommonProps & CryptoCommon.IParams> {
  formRef = React.createRef<FormInstance>()

  handleFinish = (values: IValues): void => {
    const { type } = this.props
    const output = type === 'md5' ? md5(values.input) : sha1(values.input)
    this.formRef.current?.setFieldsValue({ output })
  }

  render(): ReactElement {
    const { store } = this.props

    return (
      <Form ref={this.formRef} {...formItemLayout} onFinish={this.handleFinish}>
        <Form.Item label="字符串" name="input" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="输出" name="output">
          <Input.TextArea />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            loading={store.isLoading}
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    )
  }
}
