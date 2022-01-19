import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, Button } from 'antd'
import { FormInstance } from 'antd/es/form'

import RandExp from 'randexp'
import { stringToRegExp } from '@utils'
import { formItemLayout, tailFormItemLayout } from '@constants'

interface IValues {
  reg: string
}

@inject('store', 'actions')
@observer
export default class PageForm extends Component<RandomStr.CommonProps> {
  formRef = React.createRef<FormInstance>()

  handleFinish = (values: IValues): void => {
    const reg = stringToRegExp(values.reg)
    this.formRef.current?.setFieldsValue({ output: new RandExp(reg).gen() })
  }

  render(): ReactElement {
    return (
      <Form ref={this.formRef} {...formItemLayout} onFinish={this.handleFinish}>
        <Form.Item label="正则" name="reg" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="输出" name="output">
          <Input.TextArea />
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
