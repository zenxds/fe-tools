import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input } from 'antd'
import { FormInstance } from 'antd/es/form'

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
}

interface IProps {
  forwardRef: React.RefObject<FormInstance>
}

@inject('store', 'actions', 'dataStore')
@observer
export default class PageForm extends Component<
  CommonProps & OCR.CommonProps & IProps
> {
  render(): ReactElement {
    const { dataStore } = this.props
    return (
      <Form
        ref={this.props.forwardRef}
        initialValues={{
          secretId: dataStore.get('ocrSecretId') || '',
          secretKey: dataStore.get('ocrSecretKey') || '',
        }}
        {...formItemLayout}
      >
        <Form.Item
          label="secretId"
          name="secretId"
          rules={[{ required: true }]}
        >
          <Input placeholder="tencent secretId" />
        </Form.Item>
        <Form.Item
          label="secretKey"
          name="secretKey"
          rules={[{ required: true }]}
        >
          <Input placeholder="tencent secretKey" />
        </Form.Item>
      </Form>
    )
  }
}
