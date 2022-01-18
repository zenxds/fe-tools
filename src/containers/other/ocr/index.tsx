import React, { Component, ReactElement } from 'react'
import { observer, inject } from 'mobx-react'
import { Upload, Input, Spin, Modal, message } from 'antd'
import { InboxOutlined, SettingOutlined } from '@ant-design/icons'
import { UploadFile, UploadProps } from 'antd/lib/upload/interface'
import { FormInstance } from 'antd/es/form'

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
  }

  initOCR(): void {
    const { dataStore } = this.props
    this.ocr = new OCRParser({
      secretId: dataStore.get('ocrSecretId'),
      secretKey: dataStore.get('ocrSecretKey')
    })
  }


  handleSetting = () => {
    this.props.actions.merge({
      showSettingModal: true
    })
  }

  handleSettingOk = async(): Promise<void> => {
    const { dataStore } = this.props
    const values = await this.settingFormRef.current?.validateFields()

    message.success('保存成功')
    dataStore.set('ocrSecretId', values.secretId)
    dataStore.set('ocrSecretKey', values.secretKey)
    this.initOCR()

    this.props.actions.merge({
      showSettingModal: false
    })
  }

  handleCancelSetting = (): void => {
    this.props.actions.merge({
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
          this.process(info.fileList[0])
        }
      },
    }
  }

  getFilePath = (file: UploadFile): string => {
    return file.originFileObj?.path || ''
  }

  async process(file: UploadFile): Promise<void> {
    this.props.actions.merge({
      isLoading: true
    })

    try {
      const img = fs.readFileSync(this.getFilePath(file), 'base64')
      const result = await this.ocr.parse(img)
      this.props.actions.merge({
        output: result.map(item => item.text).join('\n'),
      })
    } catch(err) {
      message.error(err.message)
    }

    this.props.actions.merge({
      isLoading: false
    })
  }

  renderSettingModal(): ReactElement {
    const { showSettingModal } = this.props.store

    return (
      <Modal title="OCR配置" visible={showSettingModal} onCancel={this.handleCancelSetting} onOk={this.handleSettingOk}>
        <SettingForm forwardRef={this.settingFormRef} />
      </Modal>
    )
  }

  render(): ReactElement {
    const { isLoading, output } = this.props.store

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

        <div styleName="textarea">
          <div className="ant-form-item-label">
            <label>输出</label>
          </div>
          <Input.TextArea rows={10} value={output} />
        </div>

        { this.renderSettingModal() }
      </div>
    )
  }
}
