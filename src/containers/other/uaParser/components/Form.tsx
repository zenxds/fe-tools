import React, { Component, Fragment, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, Descriptions, Button } from 'antd'
import { FormInstance } from 'antd/es/form'
import Parser, { IResult } from 'ua-parser-js'

import { formItemLayout, tailFormItemLayout } from '@constants'

interface IState {
  result?: IResult
}

interface IValues {
  userAgent: string
}

@inject('store', 'actions')
@observer
export default class PageForm extends Component<UAParser.CommonProps> {
  formRef = React.createRef<FormInstance>()

  state: IState = {}

  handleFinish = (values: IValues): void => {
    const parser = new Parser(values.userAgent)
    this.setState({
      result: parser.getResult()
    })
  }

  renderResult(): ReactElement | null {
    const { result } = this.state

    if (!result) {
      return null
    }

    const map: Record<string, string | undefined> = {
      '浏览器': result.browser.name,
      '浏览器版本': result.browser.version,
      '内核': result.engine.name,
      '内核版本': result.engine.version,
      '系统': result.os.name,
      '系统版本': result.os.version,
      '设备类型': result.device.type,
      '设备品牌': result.device.vendor,
      'CPU架构': result.cpu.architecture,
    }

    return (
      <Descriptions bordered column={1}>
        {
          Object.keys(map).filter(key => map[key] !== undefined).map((key) => {
            return (
              <Descriptions.Item key={key} label={key}>
                { map[key] }
              </Descriptions.Item>
            )
          })
        }
      </Descriptions>
    )
  }

  render(): ReactElement {
    return (
      <Fragment>
        <Form ref={this.formRef} {...formItemLayout} onFinish={this.handleFinish}>
          <Form.Item label="userAgent" name="userAgent" rules={[{ required: true }]}>
            <Input.TextArea rows={10} />
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

        { this.renderResult() }
      </Fragment>
    )
  }
}
