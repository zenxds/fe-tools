import React, { Component, ReactElement } from 'react'
import { observer, inject } from 'mobx-react'
import { Upload, Spin, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { UploadFile, UploadProps } from 'antd/lib/upload/interface'
import { FormInstance } from 'antd/es/form'
import Jimp from 'jimp'

import path from 'path'
import { shell } from 'electron'

import { parsePath, getClipboardFilePath, getSaveDirectory } from '@utils'
import * as decorators from '@decorators'

import SettingForm from './components/Form'
import actions from './actions'
import store from './store'
import './less/styles.less'

@decorators.provider({
  actions,
  store,
})
@inject('store', 'actions')
@observer
export default class Page extends Component<
  CommonProps & ImageSlice.CommonProps
> {
  settingFormRef: React.RefObject<FormInstance>

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

  getUploadProps = (): UploadProps => {
    return {
      accept: 'image/png, image/jpeg, image/jpg',
      multiple: false,
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
    const sliceHeight = this.props.store!.height
    if (!sliceHeight) {
      message.error('请先设置裁切高度')
      return
    }

    const { extname, filename, dirname } = parsePath(filePath)
    const saveDirectory = getSaveDirectory(dirname)

    if (!saveDirectory) {
      return
    }

    this.props.actions!.merge({
      isLoading: true,
    })

    const slicePaths: string[] = []
    try {
      const image = await Jimp.read(filePath)
      const { width, height } = image.bitmap
      const sliceHeights = sliceHeight.split(/\s+/)

      let i = 0
      let remain = height

      while (remain > 0) {
        let currentHeight = 0
        if (sliceHeights.length === 1) {
          currentHeight = Number(sliceHeights[0])
        } else {
          currentHeight = sliceHeights[i] ? Number(sliceHeights[i]) : remain
        }

        if (currentHeight > remain) {
          currentHeight = remain
        }

        const filePath = path.join(saveDirectory, `${filename}-${i}${extname}`)
        slicePaths.push(filePath)

        await image
          .clone()
          .crop(0, height - remain, width, currentHeight)
          .writeAsync(filePath)
        i = i + 1
        remain = remain - currentHeight
      }

      message.success('裁切成功')
      // shell.openPath(saveDirectory)
      shell.showItemInFolder(slicePaths[0])
    } catch (err) {
      message.error(err.message)
    }

    this.props.actions!.merge({
      isLoading: false,
    })
  }

  render(): ReactElement {
    const { isLoading } = this.props.store!

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

        <div styleName="form">
          <SettingForm />
        </div>
      </div>
    )
  }
}
