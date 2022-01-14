import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, InputNumber, Button } from 'antd'
import { FormInstance } from 'antd/es/form'

import { randomNum } from '@utils'
import { formItemLayout, tailFormItemLayout } from '@constants'

interface IValues {
  min: number
  max: number
}

@inject('store', 'actions')
@observer
export default class PageForm extends Component<RandomNum.CommonProps> {
  formRef = React.createRef<FormInstance>()

  componentDidMount() {
    this.formRef.current?.submit()
  }

  handleFinish = (values: IValues): void => {
    this.formRef.current?.setFieldsValue({ output: randomNum(values.min, values.max) })
  }

  render(): ReactElement {
    const { store } = this.props

    return (
      <Form ref={this.formRef} {...formItemLayout} initialValues={{ min: 1, max: 100 }} onFinish={this.handleFinish}>
        <Form.Item label="最小" name="min" rules={[{ required: true }]}>
          <InputNumber />
        </Form.Item>

        <Form.Item label="最大" name="max" rules={[{ required: true }]}>
          <InputNumber />
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
