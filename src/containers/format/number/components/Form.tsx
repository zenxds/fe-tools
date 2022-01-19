import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, Space, Button } from 'antd'
import { FormInstance } from 'antd/es/form'

import { formItemLayout, tailFormItemLayout } from '@constants'

interface IState {
  numberType: FormatNumber.NumberType
}

import '../less/styles.less'

@inject('store', 'actions')
@observer
export default class PageForm extends Component<FormatNumber.CommonProps> {
  formRef = React.createRef<FormInstance>()

  state: IState = {
    numberType: '10',
  }

  handleFinish = () => {
    this.handleTransform(this.formRef.current?.getFieldValue(this.state.numberType))
  }

  handleChange = (type: FormatNumber.NumberType): void => {
    this.setState({
      numberType: type
    })
  }

  handleTransform = (val: string): void => {
    const num = parseInt(val, Number(this.state.numberType))
    this.formRef.current?.setFieldsValue({
      2: num.toString(2),
      8: num.toString(8),
      10: num.toString(10),
      16: num.toString(16),
    })
  }

  render(): ReactElement {
    return (
      <Form ref={this.formRef} {...formItemLayout} onFinish={this.handleFinish}>
        <Form.Item label="二进制" name="2">
          <Input onChange={this.handleChange.bind(this, '2')} />
        </Form.Item>

        <Form.Item label="八进制" name="8">
          <Input onChange={this.handleChange.bind(this, '8')} />
        </Form.Item>

        <Form.Item label="十进制" name="10">
          <Input onChange={this.handleChange.bind(this, '10')} />
        </Form.Item>

        <Form.Item label="十六进制" name="16">
          <Input onChange={this.handleChange.bind(this, '16')} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
            >
              转换
            </Button>
          </Space>
        </Form.Item>
      </Form>
    )
  }
}
