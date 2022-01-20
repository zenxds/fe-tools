import React, { Component, ReactElement } from 'react'
import { observer, inject } from 'mobx-react'
import { Upload, Spin, Modal, message } from 'antd'
import { debounce } from 'lodash'
import { InboxOutlined, SettingOutlined } from '@ant-design/icons'
import { UploadFile, UploadProps } from 'antd/lib/upload/interface'
import { FormInstance } from 'antd/es/form'

import path from 'path'
import { ipcRenderer, shell } from 'electron'

import * as decorators from '@decorators'

import SettingForm from './components/Form'
import actions from './actions'
import store from './store'
import './less/styles.less'

const tinify = nodeRequire('tinify')

@decorators.provider({
  actions,
  store
})
@inject('store', 'actions', 'dataStore')
@observer
export default class Page extends Component<CommonProps & CompressIMG.CommonProps> {
  settingFormRef: React.RefObject<FormInstance>

  constructor(props: CommonProps & CompressIMG.CommonProps) {
    super(props)

    this.compress = debounce(this.compress, 300)
    this.settingFormRef = React.createRef<FormInstance>()
  }

  handleSetting = () => {
    this.props.actions.merge({
      showSettingModal: true
    })
  }

  handleSettingOk = async(): Promise<void> => {
    try {
      const values = await this.settingFormRef.current?.validateFields()
      message.success('保存成功')
      tinify.key = values.apiKey
      this.props.dataStore.set('tinifyKey', values.apiKey)
      this.props.actions.merge({
        showSettingModal: false
      })
    } catch(err) {}
  }

  handleCancelSetting = (): void => {
    this.props.actions.merge({
      showSettingModal: false
    })
  }

  componentDidMount() {
    const key = this.props.dataStore.get('tinifyKey') || ''
    if (key) {
      tinify.key = key
    } else {
      this.handleSetting()
    }
  }

  getUploadProps = (): UploadProps => {
    return {
      accept: 'image/png, image/jpeg, image/jpg',
      multiple: true,
      fileList: [],
      beforeUpload: (): boolean => false,
      onChange: info => {
        this.compress(info.fileList)
      },
    }
  }

  getFilePath = (file: UploadFile): string => {
    return file.originFileObj?.path || ''
  }

  async compress(files: UploadFile[]): Promise<void> {
    if (!files.length) {
      return
    }

    // open返回的是数组
    const savePath = files.length > 1 ? ipcRenderer.sendSync('showOpenDialog', {
      defaultPath: path.dirname(this.getFilePath(files[0])),
      properties: ['openDirectory', 'createDirectory'],
    }): ipcRenderer.sendSync('showSaveDialog', {
      defaultPath: this.getFilePath(files[0]),
      properties: []
    })

    if (!savePath) {
      return
    }

    this.props.actions.merge({
      isLoading: true
    })

    try {
      if (files.length > 1) {
        await Promise.all(files.map((file: UploadFile) => {
          const p = this.getFilePath(file)
          return tinify.fromFile(p).toFile(savePath[0] + '/' + path.basename(p))
        }))
      } else {
        const p = this.getFilePath(files[0])
        await tinify.fromFile(p).toFile(savePath)
      }

      message.success('压缩成功')
      if (files.length > 1) {
        shell.openPath(savePath[0])
      } else {
        shell.showItemInFolder(savePath)
      }
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
      <Modal title="压缩配置" visible={showSettingModal} onCancel={this.handleCancelSetting} onOk={this.handleSettingOk}>
        <SettingForm forwardRef={this.settingFormRef} />
      </Modal>
    )
  }

  render(): ReactElement {
    const { isLoading } = this.props.store

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

        { this.renderSettingModal() }
      </div>
    )
  }
}
