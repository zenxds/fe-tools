import React, { Component, Fragment, ReactElement } from 'react'
import { observer, inject } from 'mobx-react'
import { Upload, Input, Button, Space, Spin, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { UploadFile, UploadProps } from 'antd/lib/upload/interface'

import fs from 'fs'
import { clipboard, nativeImage, ipcRenderer, shell } from 'electron'
import dataURI from 'datauri'

import { getClipboardFilePath, randomStr, parseDataURI } from '@utils'
import * as decorators from '@decorators'

import actions from './actions'
import store from './store'
import './less/styles.less'

@decorators.provider({
  actions,
  store,
})
@inject('store', 'actions', 'dataStore')
@observer
export default class Page extends Component<
  CommonProps & EncodeFile.CommonProps
> {
  getUploadProps = (): UploadProps => {
    return {
      accept: 'image/png, image/jpeg, image/jpg',
      fileList: [],
      beforeUpload: (): boolean => false,
      onChange: info => {
        if (info.fileList.length) {
          this.transform(this.getFilePath(info.fileList[0]))
        }
      },
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

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    this.props.actions!.merge({
      output: e.target.value,
    })
  }

  handlePaste = async (): Promise<void> => {
    const filePath = getClipboardFilePath()
    if (filePath) {
      return this.transform(filePath)
    }

    const img = clipboard.readImage()
    if (img.isEmpty()) {
      return
    }

    this.props.actions!.merge({
      output: img.toDataURL(),
    })
  }

  async transform(filePath: string): Promise<void> {
    this.props.actions!.merge({
      isLoading: true,
    })

    try {
      const output = await dataURI(filePath)
      this.props.actions!.merge({
        output,
        isLoading: false,
      })
    } catch (err) {
      message.error(err.message)
      this.props.actions!.merge({
        isLoading: false,
      })
    }
  }

  handleCopy = (): void => {
    const { output } = this.props.store!

    if (!output) {
      return
    }

    const img = nativeImage.createFromDataURL(output)
    clipboard.writeImage(img)
    message.success('复制成功')
  }

  handleSave = (): void => {
    const { output } = this.props.store!

    if (!output) {
      return
    }

    const { subtype, data } = parseDataURI(output)
    const savePath = ipcRenderer.sendSync('showSaveDialog', {
      defaultPath: randomStr(32) + '.' + subtype,
      properties: [],
    })

    if (savePath) {
      fs.writeFileSync(savePath, data, 'base64')
      shell.showItemInFolder(savePath)
    }
  }

  render(): ReactElement {
    const { isLoading, output } = this.props.store!

    return (
      <div className="container">
        <Spin spinning={isLoading}>
          <Upload.Dragger {...this.getUploadProps()}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">拖拽文件到此区域</p>
          </Upload.Dragger>
        </Spin>

        <div styleName="section">
          <div className="ant-form-item-label">
            <label>输出</label>
          </div>
          <Input.TextArea
            rows={6}
            value={output}
            onChange={this.handleChange}
          />
        </div>

        {output && (
          <Fragment>
            <div styleName="section">
              <img src={output} />
            </div>
            <div styleName="section">
              <Space>
                <Button onClick={this.handleCopy} type="default">
                  复制
                </Button>
                <Button onClick={this.handleSave} type="default">
                  保存
                </Button>
              </Space>
            </div>
          </Fragment>
        )}
      </div>
    )
  }
}
