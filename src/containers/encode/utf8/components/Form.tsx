import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, Space, Button } from 'antd'
import { FormInstance } from 'antd/es/form'

import * as utf8 from '@utils/utf8'
import { formItemLayout, tailFormItemLayout } from '@constants'

interface IState {
  submitType: 'encode' | 'decode'
}

interface IValues {
  input: string
}

@inject('store', 'actions')
@observer
export default class PageForm extends Component<EncodeUtf8.CommonProps> {
  formRef = React.createRef<FormInstance>()

  state: IState = {
    submitType: 'encode'
  }

  handleSubmit(type: 'encode' | 'decode'): void {
    this.setState({ submitType: type }, () => {
      this.formRef.current?.submit()
    })
  }

  handleFinish = (values: IValues): void => {
    const { submitType } = this.state
    this.formRef.current?.setFieldsValue({ output: utf8[submitType](values.input) })
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
          <Space>
            <Button
              type="primary"
              onClick={this.handleSubmit.bind(this, 'encode')}
              loading={store.isLoading}
            >
              编码
            </Button>
            <Button
              type="primary"
              onClick={this.handleSubmit.bind(this, 'decode')}
              loading={store.isLoading}
            >
              解码
            </Button>
          </Space>
        </Form.Item>
      </Form>
    )
  }
}