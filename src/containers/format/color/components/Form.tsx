import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, Space, Button, message } from 'antd'
import { FormInstance } from 'antd/es/form'
import Color from 'tinycolor2'
import { SketchPicker, ColorResult, RGBColor } from 'react-color'

import { randomColor } from '@utils'
import { formItemLayout, tailFormItemLayout } from '@constants'

interface IState {
  colorType: FormatColor.ColorType
  color: string | RGBColor
}

import '../less/styles.less'

@inject('store', 'actions')
@observer
export default class PageForm extends Component<FormatColor.CommonProps> {
  formRef = React.createRef<FormInstance>()

  state: IState = {
    colorType: 'hex',
    color: ''
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

  handleChangeComplete = (color: ColorResult) => {
    this.handleTransform(color.rgb)
  }

  handleTransform = (val: string | RGBColor): void => {
    const color = Color(val)

    if (!color.isValid()) {
      message.error('颜色值不合法')
      return
    }

    this.formRef.current?.setFieldsValue({
      hex: color.toHexString(),
      rgb: color.toRgbString(),
      hsl: color.toHslString(),
    })

    this.setState({
      color: color.toRgbString()
    })
  }

  handleRandom = (): void => {
    this.handleTransform(randomColor())
  }

  render(): ReactElement {
    const { color } = this.state
    return (
      <Form ref={this.formRef} {...formItemLayout} onFinish={this.handleFinish}>
        <Form.Item label="颜色">
          <SketchPicker color={color} onChangeComplete={this.handleChangeComplete} />
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
