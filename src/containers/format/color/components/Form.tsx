import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, Space, Button } from 'antd'
import Color from 'color'
import { FormInstance } from 'antd/es/form'

import { randomColor } from '@utils'
import { formItemLayout, tailFormItemLayout } from '@constants'

interface IState {
  colorType: FormatColor.ColorType
  rgb: string
}

import '../less/styles.less'

@inject('store', 'actions')
@observer
export default class PageForm extends Component<FormatColor.CommonProps> {
  formRef = React.createRef<FormInstance>()

  state: IState = {
    colorType: 'hex',
    rgb: ''
  }

  componentDidMount() {
    this.handleRandom()
  }

  handleFinish = () => {
    this.handleTransform(this.formRef.current?.getFieldValue(this.state.colorType))
  }

  handleChange = (type: FormatColor.ColorType): void => {
    this.setState({
      colorType: type
    })
  }

  // https://github.com/Qix-/color/issues/127
  handleTransform = (val: string): void => {
    const color = Color(val)
    this.formRef.current?.setFieldsValue({
      hex: color.hex(),
      rgb: color.rgb().string(),
      hsl: color.hsl().string(),
    })

    this.setState({
      rgb: color.rgb().string()
    })
  }

  handleRandom = (): void => {
    this.handleTransform(randomColor())
  }

  render(): ReactElement {
    const { rgb } = this.state
    return (
      <Form ref={this.formRef} {...formItemLayout} onFinish={this.handleFinish}>
        <Form.Item label="颜色">
          <span styleName="color" style={{ background: rgb }}></span>
        </Form.Item>

        <Form.Item label="十六进制" name="hex">
          <Input onChange={this.handleChange.bind(this, 'hex')} />
        </Form.Item>

        <Form.Item label="RGB" name="rgb">
          <Input onChange={this.handleChange.bind(this, 'rgb')} />
        </Form.Item>

        <Form.Item label="HSL" name="hsl">
          <Input onChange={this.handleChange.bind(this, 'hsl')} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
            >
              转换
            </Button>
            <Button
              type="primary"
              onClick={this.handleRandom}
            >
              随机颜色
            </Button>
          </Space>
        </Form.Item>
      </Form>
    )
  }
}
