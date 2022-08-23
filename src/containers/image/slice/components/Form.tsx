import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input } from 'antd'
// import { FormInstance } from 'antd/es/form'

import { formItemLayout } from '@constants'

@inject('store', 'actions')
@observer
export default class PageForm extends Component<ImageSlice.CommonProps> {
  handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.props.actions!.merge({
      height: e.target.value
    })
  }


  render(): ReactElement {
    return (
      <Form initialValues={{}} {...formItemLayout}>
        <Form.Item label="裁切高度" name="height" rules={[{ required: true }]}>
          <Input placeholder="多个值以空格隔开" onChange={this.handleChange} />
        </Form.Item>
      </Form>
    )
  }
}
