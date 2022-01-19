import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, InputNumber, Button } from 'antd'
import { FormInstance } from 'antd/es/form'

import { randomStr } from '@utils'
import { formItemLayout, tailFormItemLayout } from '@constants'

interface IValues {
  length: number
}

@inject('store', 'actions')
@observer
export default class PageForm extends Component<RandomStr.CommonProps> {
  formRef = React.createRef<FormInstance>()

  componentDidMount() {
    this.formRef.current?.submit()
  }

  handleFinish = (values: IValues): void => {
    this.formRef.current?.setFieldsValue({ output: randomStr(values.length) })
  }

  render(): ReactElement {
    return (
      <Form ref={this.formRef} {...formItemLayout} initialValues={{ length: 32 }} onFinish={this.handleFinish}>
        <Form.Item label="长度" name="length" rules={[{ required: true }]}>
          <InputNumber />
        </Form.Item>

        <Form.Item label="输出" name="output">
          <Input.TextArea />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
          >
            生成
          </Button>
        </Form.Item>
      </Form>
    )
  }
}
