import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, message, Space, Button } from 'antd'
import { FormInstance } from 'antd/es/form'
import dayjs from 'dayjs'

import { formItemLayout, tailFormItemLayout } from '@constants'

interface IValues {
  input: string
}

import '../less/styles.less'

@inject('store', 'actions')
@observer
export default class PageForm extends Component<FormatTime.CommonProps> {
  formRef = React.createRef<FormInstance>()

  componentDidMount() {
    this.formRef.current?.submit()
  }

  handleFinish = (values: IValues): void => {
    try {
      const time = dayjs(/^\d{13}$/.test(values.input) ? Number(values.input) : values.input)
      this.formRef.current?.setFieldsValue({
        iso: time.toISOString(),
        timestamp: time.valueOf(),
        utc: time.toDate().toUTCString(),
        format: time.format('YYYY-MM-DD HH:mm:ss'),
      })
    } catch(err) {
      message.error(err.message)
    }
  }

  render(): ReactElement {
    return (
      <Form ref={this.formRef} {...formItemLayout} initialValues={{ input: Date.now() }} onFinish={this.handleFinish}>
        <Form.Item label="输入" name="input" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="时间戳" name="timestamp">
          <Input />
        </Form.Item>

        <Form.Item label="格式化" name="format">
          <Input />
        </Form.Item>

        <Form.Item label="ISO" name="iso">
          <Input />
        </Form.Item>

        <Form.Item label="UTC" name="utc">
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
