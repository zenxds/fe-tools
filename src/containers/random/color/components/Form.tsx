import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, Button } from 'antd'
import { FormInstance } from 'antd/es/form'

import { randomColor } from '@utils'
import { formItemLayout, tailFormItemLayout } from '@constants'

@inject('store', 'actions')
@observer
export default class PageForm extends Component<RandomColor.CommonProps> {
  formRef = React.createRef<FormInstance>()

  componentDidMount() {
    this.formRef.current?.submit()
  }

  handleFinish = (): void => {
    this.formRef.current?.setFieldsValue({ output: randomColor() })
  }

  render(): ReactElement {
    const { store } = this.props

    return (
      <Form ref={this.formRef} {...formItemLayout} onFinish={this.handleFinish}>
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
