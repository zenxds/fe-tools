import React, { Component, ReactElement } from 'react'
import { observer, inject } from 'mobx-react'
import { Upload, Input, Spin, Modal, message } from 'antd'
import { InboxOutlined, SettingOutlined } from '@ant-design/icons'
import { UploadFile, UploadProps } from 'antd/lib/upload/interface'
import { FormInstance } from 'antd/es/form'

import { clipboard } from 'electron'
import { getClipboardFilePath } from '@utils'
import fs from 'fs'

import * as decorators from '@decorators'
import OCRParser from '@utils/OCRParser'

import SettingForm from './components/Form'
import actions from './actions'
import store from './store'
import './less/styles.less'

@decorators.provider({
  actions,
  store
})
@inject('store', 'actions', 'dataStore')
@observer
export default class Page extends Component<CommonProps & OCR.CommonProps> {
  settingFormRef: React.RefObject<FormInstance>
  ocr: OCRParser

  constructor(props: CommonProps & OCR.CommonProps) {
    super(props)

    this.settingFormRef = React.createRef<FormInstance>()
  }

  componentDidMount() {
    const { dataStore } = this.props

    if (!dataStore.get('ocrSecretId') || !dataStore.get('ocrSecretKey')) {
      this.handleSetting()
    } else {
      this.initOCR()
    }

    document.addEventListener('paste', this.handlePaste, false)
  }

  componentWillUnmount() {
    document.removeEventListener('paste', this.handlePaste, false)
  }

  handlePaste = async(): Promise<void> => {
    const filePath = getClipboardFilePath()
    if (filePath) {
      return this.process(filePath)
    }

    const img = clipboard.readImage()
    if (img.isEmpty()) {
      return
    }

    this.props.actions!.merge({
      isLoading: true
    })

    try {
      const result = await this.ocr.parse(img.toDataURL().split(',')[1])
      this.props.actions!.merge({
        output: result.map(item => item.text).join('\n'),
      })
    } catch(err) {
      message.error(err.message)
    }

    this.props.actions!.merge({
      isLoading: false
    })
  }

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    this.props.actions!.merge({
      output: e.target.value
    })
  }

  initOCR(): void {
    const { dataStore } = this.props
    this.ocr = new OCRParser({
      secretId: dataStore.get('ocrSecretId'),
      secretKey: dataStore.get('ocrSecretKey')
    })
  }


  handleSetting = () => {
    this.props.actions!.merge({
      showSettingModal: true
    })
  }

  handleSettingOk = async(): Promise<void> => {
    const { dataStore } = this.props

    try {
      const values = await this.settingFormRef.current?.validateFields()
      message.success('保存成功')
      dataStore.set('ocrSecretId', values.secretId)
      dataStore.set('ocrSecretKey', values.secretKey)
      this.initOCR()

      this.props.actions!.merge({
        showSettingModal: false
      })
    } catch(err) {}
  }

  handleCancelSetting = (): void => {
    this.props.actions!.merge({
      showSettingModal: false
    })
  }

  getUploadProps = (): UploadProps => {
    return {
      accept: 'image/png, image/jpeg, image/jpg',
      fileList: [],
      beforeUpload: (): boolean => false,
      onChange: info => {
        if (info.fileList.length) {
          this.process(this.getFilePath(info.fileList[0]))
        }
      },
    }
  }

  getFilePath = (file: UploadFile): string => {
    return file.originFileObj?.path || ''
  }

  async process(filePath: string): Promise<void> {
    const { actions } = this.props

    actions!.merge({
      isLoading: true
    })

    try {
      const img = fs.readFileSync(filePath, 'base64')
      const result = await this.ocr.parse(img)
      actions!.merge({
        output: result.map(item => item.text).join('\n'),
      })
    } catch(err) {
      message.error(err.message)
    }

    actions!.merge({
      isLoading: false
    })
  }

  renderSettingModal(): ReactElement {
    const { showSettingModal } = this.props.store!

    return (
      <Modal title="OCR配置" visible={showSettingModal} onCancel={this.handleCancelSetting} onOk={this.handleSettingOk}>
        <SettingForm dataStore={this.props.dataStore} forwardRef={this.settingFormRef} />
      </Modal>
    )
  }

  render(): ReactElement {
    const { isLoading, output } = this.props.store!

    return (
      <div className="container">
        <div styleName="config">
          <SettingOutlined onClick={this.handleSetting} />
        </div>
        <Spin spinning={isLoading}>
          <Upload.Dragger {...this.getUploadProps()}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">拖拽文件到此区域</p>
          </Upload.Dragger>
        </Spin>

        {
          output && (
            <div styleName="textarea">
              <div className="ant-form-item-label">
                <label>结果</label>
              </div>
              <Input.TextArea rows={10} value={output} onChange={this.handleChange} />
            </div>
          )
        }

        { this.renderSettingModal() }
      </div>
    )
  }
}
