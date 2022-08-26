import React, { Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, Upload,  } from 'antd'
import { FormInstance } from 'antd/es/form'
import { InboxOutlined } from '@ant-design/icons'
import { UploadFile, UploadProps } from 'antd/lib/upload/interface'

import { sha1File, md5File, getClipboardFilePath } from '@utils'
import { formItemLayout } from '@constants'

interface IValues {
  input: string
}

const cryptoMethods: Record<CryptoCommon.CryptoTypes, (str: string) => Promise<string>> = {
  md5: md5File,
  sha1: sha1File
}

@inject('store', 'actions')
@observer
export default class PageForm extends Component<CryptoCommon.CommonProps & CryptoCommon.IParams> {
  formRef = React.createRef<FormInstance>()

  componentDidUpdate(prevProps: CryptoCommon.CommonProps & CryptoCommon.IParams): void {
    const { type } = this.props

    if (prevProps.type !== type) {
      this.formRef.current?.resetFields()
    }
  }

  getFilePath = (file: UploadFile): string => {
    return file.originFileObj?.path || ''
  }

  componentDidMount() {
    document.addEventListener('paste', this.handlePaste, false)
  }

  componentWillUnmount() {
    document.removeEventListener('paste', this.handlePaste, false)
  }

  handlePaste = async (event: ClipboardEvent): Promise<void> => {
    const filePath = getClipboardFilePath()
    if (filePath) {
      this.process(filePath)
      event.preventDefault()
    }
  }

  async process(filePath: string): Promise<void> {
    const { type } = this.props
    const output = await cryptoMethods[type](filePath)
    this.formRef.current?.setFieldsValue({ output })
  }

  getUploadProps = (): UploadProps => {
    return {
      fileList: [],
      beforeUpload: (): boolean => false,
      onChange: info => {
        if (info.fileList.length) {
          this.process(this.getFilePath(info.fileList[0]))
        }
      },
    }
  }

  handleFinish = (values: IValues): void => {
    const { type } = this.props
    const output = cryptoMethods[type](values.input)
    this.formRef.current?.setFieldsValue({ output })
  }

  render(): ReactElement {
    return (
      <Form ref={this.formRef} {...formItemLayout} onFinish={this.handleFinish}>
        <Upload.Dragger {...this.getUploadProps()}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">拖拽文件到此区域</p>
        </Upload.Dragger>

        <Form.Item label="输出" name="output" style={{ marginTop: 20 }}>
          <Input.TextArea rows={5} />
        </Form.Item>
      </Form>
    )
  }
}
