import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input } from 'antd'
import { FormInstance } from 'antd/es/form'

import { formItemLayout } from '@constants'

interface IProps {
  forwardRef: React.RefObject<FormInstance>
}

@inject('store', 'actions')
@observer
export default class PageForm extends Component<CompressIMG.CommonProps & IProps> {
  render(): ReactElement {
    return (
      <Form ref={this.props.forwardRef} {...formItemLayout}>
        <Form.Item label="APIKey" name="apiKey" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    )
  }
}
