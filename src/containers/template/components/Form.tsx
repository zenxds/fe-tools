import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, Button } from 'antd'
import { FormInstance } from 'antd/es/form'

import { formItemLayout, tailFormItemLayout } from '@constants'

interface IValues {
  field1: string
}

@inject('store', 'actions')
@observer
export default class PageForm extends Component<Template.CommonProps> {
  formRef = React.createRef<FormInstance>()

  handleFinish = (values: IValues): void => {
    console.log(values)
  }

  render(): ReactElement {
    return (
      <Form ref={this.formRef} {...formItemLayout} onFinish={this.handleFinish}>
        <Form.Item label="字段1" name="field1" rules={[{ required: true }]}>
          <Input />
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
