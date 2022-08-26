import React, { Component, Fragment, ReactElement } from 'react'
import { observer, inject } from 'mobx-react'
import { Upload, Input, Button, Space, Spin, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { UploadFile, UploadProps } from 'antd/lib/upload/interface'

import fs from 'fs'
import path from 'path'
import { clipboard, nativeImage, shell } from 'electron'
import dataURI from 'datauri'
// import DatauriParser from 'datauri/parser'

import {
  getClipboardFilePath,
  randomStr,
  parseDataURI,
  toPNG,
  getSavePath,
} from '@utils'
import { encodeSVG, decodeSVG } from '@utils/encode/base64'
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
      accept: 'image/*',
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

  handlePaste = async (event: ClipboardEvent): Promise<void> => {
    const filePath = getClipboardFilePath()
    if (filePath) {
      this.transform(filePath)
      event.preventDefault()
      return
    }

    const img = clipboard.readImage()
    if (!img.isEmpty()) {
      this.props.actions!.merge({
        output: img.toDataURL(),
      })

      event.preventDefault()
      return
    }

    const text = clipboard.readText()
    if (/<svg/.test(text)) {
      this.handleSVG(text)
      event.preventDefault()
    }
  }

  handleSVG = (text: string): void => {
    // const svg = text.indexOf('xmlns') > -1 ? text : text.replace(/<svg/, '<svg xmlns="http://www.w3.org/2000/svg"')
    // const parser = new DatauriParser()
    // this.props.actions!.merge({
    //   output: parser.format('.svg', Buffer.from(svg)).content,
    // })

    this.props.actions!.merge({
      output: encodeSVG(text),
    })
  }

  async transform(filePath: string): Promise<void> {
    if (path.extname(filePath) === '.svg') {
      const text = fs.readFileSync(filePath, 'utf8')
      this.handleSVG(text)
      return
    }

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

  handleCopyPNG = (): void => {
    const { output } = this.props.store!

    if (!output) {
      return
    }

    const { data } = parseDataURI(output)
    const img = nativeImage.createFromDataURL(toPNG(decodeSVG(data)))
    clipboard.writeImage(img)
    message.success('复制成功')
  }

  handleSave = (): void => {
    const { output } = this.props.store!

    if (!output) {
      return
    }

    const { ext, data } = parseDataURI(output)
    const savePath = getSavePath(randomStr(32) + '.' + ext)

    if (savePath) {
      return
    }

    if (ext === 'svg') {
      fs.writeFileSync(savePath, decodeSVG(data), 'utf8')
    } else {
      fs.writeFileSync(savePath, data, 'base64')
    }
    shell.showItemInFolder(savePath)
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
                {/image\/svg/.test(output) ? (
                  <Button onClick={this.handleCopyPNG} type="default">
                    复制为PNG
                  </Button>
                ) : null}
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
