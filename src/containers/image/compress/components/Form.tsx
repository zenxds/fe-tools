import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input } from 'antd'
import { FormInstance } from 'antd/es/form'

import { formItemLayout } from '@constants'

interface IProps {
  forwardRef: React.RefObject<FormInstance>
}

@inject('store', 'actions', 'dataStore')
@observer
export default class PageForm extends Component<CommonProps & ImageCompress.CommonProps & IProps> {
  render(): ReactElement {
    const { dataStore } = this.props
    return (
      <Form ref={this.props.forwardRef} initialValues={{ apiKey: dataStore.get('tinifyKey') || '' }} {...formItemLayout}>
        <Form.Item label="APIKey" name="apiKey" rules={[{ required: true }]}>
          <Input placeholder="tinypng API Key" />
        </Form.Item>
      </Form>
    )
  }
}
