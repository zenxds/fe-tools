import React, { Component, ReactElement } from 'react'
import { observer, inject } from 'mobx-react'
import { Upload, Input, Spin, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { UploadFile, UploadProps } from 'antd/lib/upload/interface'

import dataURI from 'datauri'

import * as decorators from '@decorators'

import actions from './actions'
import store from './store'
import './less/styles.less'

@decorators.provider({
  actions,
  store
})
@inject('store', 'actions', 'dataStore')
@observer
export default class Page extends Component<CommonProps & EncodeFile.CommonProps> {
  getUploadProps = (): UploadProps => {
    return {
      accept: 'image/png, image/jpeg, image/jpg',
      fileList: [],
      beforeUpload: (): boolean => false,
      onChange: info => {
        if (info.fileList.length) {
          this.transform(info.fileList[0])
        }
      },
    }
  }

  getFilePath = (file: UploadFile): string => {
    return file.originFileObj?.path || ''
  }

  async transform(file: UploadFile): Promise<void> {
    this.props.actions.merge({
      isLoading: true
    })

    try {
      const output = await dataURI(this.getFilePath(file))
      this.props.actions.merge({
        output,
        isLoading: false
      })
    } catch(err) {
      message.error(err.message)
      this.props.actions.merge({
        isLoading: false
      })
    }
  }

  render(): ReactElement {
    const { isLoading, output } = this.props.store

    return (
      <div className="container">
        <Spin spinning={isLoading}>
          <Upload.Dragger {...this.getUploadProps()}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">拖拽文件到此区域</p>
          </Upload.Dragger>

          <div styleName="textarea">
            <div className="ant-form-item-label">
              <label>输出</label>
            </div>
            <Input.TextArea rows={5} value={output} />
          </div>
        </Spin>
      </div>
    )
  }
}
