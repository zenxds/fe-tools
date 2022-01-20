import React, { Component, Fragment, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, Descriptions, Button } from 'antd'
import { FormInstance } from 'antd/es/form'

import { formItemLayout, tailFormItemLayout } from '@constants'

interface IState {
  result?: URL
}

interface IValues {
  url: string
}

@inject('store', 'actions')
@observer
export default class PageForm extends Component<URLParser.CommonProps> {
  formRef = React.createRef<FormInstance>()

  state: IState = {}

  handleFinish = (values: IValues): void => {
    this.setState({
      result: new URL(values.url),
    })
  }

  renderResult(): ReactElement | null {
    const { result } = this.state

    if (!result) {
      return null
    }

    return (
      <Descriptions bordered column={1}>
        <Descriptions.Item label="protocol">
          {result.protocol.replace(':', '')}
        </Descriptions.Item>
        <Descriptions.Item label="hostname">
          {result.hostname}
        </Descriptions.Item>
        <Descriptions.Item label="port">
          {result.port || (result.protocol === 'https:' ? 443 : 80)}
        </Descriptions.Item>
        <Descriptions.Item label="pathname">
          {result.pathname}
        </Descriptions.Item>
        <Descriptions.Item label="origin">{result.origin}</Descriptions.Item>
        <Descriptions.Item label="params">
          <pre>
            { JSON.stringify(Object.fromEntries(result.searchParams), null, 2) }
          </pre>
        </Descriptions.Item>
        <Descriptions.Item label="hash">{result.hash}</Descriptions.Item>
      </Descriptions>
    )
  }

  render(): ReactElement {
    return (
      <Fragment>
        <Form
          ref={this.formRef}
          {...formItemLayout}
          onFinish={this.handleFinish}
        >
          <Form.Item label="URL" name="url" rules={[{ required: true }]}>
            <Input.TextArea rows={10} />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              解析
            </Button>
          </Form.Item>
        </Form>

        {this.renderResult()}
      </Fragment>
    )
  }
}
