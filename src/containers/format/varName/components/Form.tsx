import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, message, Space, Button } from 'antd'
import { FormInstance } from 'antd/es/form'

import { underscored, hyphened, camelCase } from '@utils'
import { formItemLayout, tailFormItemLayout } from '@constants'

interface IValues {
  input: string
}

import '../less/styles.less'

@inject('store', 'actions')
@observer
export default class PageForm extends Component<FormatVarName.CommonProps> {
  formRef = React.createRef<FormInstance>()

  handleFinish = (values: IValues): void => {
    try {
      const input = values.input || ''
      this.formRef.current?.setFieldsValue({
        camel:  camelCase(input),
        upperCamel: camelCase(input, true),
        underscored: underscored(input),
        hyphened: hyphened(input),
        constant: underscored(input).toUpperCase(),
      })
    } catch(err) {
      message.error(err.message)
    }
  }

  render(): ReactElement {
    return (
      <Form ref={this.formRef} {...formItemLayout} onFinish={this.handleFinish}>
        <Form.Item label="输入" name="input" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="驼峰" name="camel">
          <Input />
        </Form.Item>

        <Form.Item label="帕斯卡" name="upperCamel">
          <Input />
        </Form.Item>

        <Form.Item label="下划线" name="underscored">
          <Input />
        </Form.Item>

        <Form.Item label="连字符" name="hyphened">
          <Input />
        </Form.Item>

        <Form.Item label="常量" name="constant">
          <Input />
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
