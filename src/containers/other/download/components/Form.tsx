import React, { Component, Fragment, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import {
  Form,
  Input,
  Radio,
  Space,
  Button,
  message,
  RadioChangeEvent,
} from 'antd'
import { FormInstance } from 'antd/es/form'

import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { once } from 'events'
import { ipcRenderer, shell } from 'electron'

import { formItemLayout, tailFormItemLayout } from '@constants'
import { randomStr, parsePath, md5File, substitute } from '@utils'
import '../less/styles.less'

const http = axios.create({
  adapter: require('axios/lib/adapters/http'),
})

interface IState {
  filterType: 'none' | 'image' | 'custom'
  fileNameFormat: 'original' | 'random' | 'md5' | 'custom'
}

interface IValues {
  input: string
  filterType: IState['filterType']
  fileNameFormat: IState['fileNameFormat']
  customFilter?: string
  customFileName?: string
}

@inject('store', 'actions')
@observer
export default class PageForm extends Component<Download.CommonProps> {
  formRef = React.createRef<FormInstance>()

  state: IState = {
    filterType: 'none',
    fileNameFormat: 'original',
  }

  handleRadioChange = (type: string, e: RadioChangeEvent): void => {
    this.setState({
      [type]: e.target.value,
    })
  }

  getUrls(values: IValues) {
    const { input, filterType, customFilter } = values
    let urls = input
      .split('\n')
      .map(line => line.trim())
      .filter(line => {
        return /^(http|\/\/)/.test(line)
      })

    if (filterType === 'image') {
      urls = urls.filter(item =>
        /\.(jpg|jpeg|png|gif|svg|ico|webp)$/i.test(item.split('?')[0]),
      )
    }

    if (filterType === 'custom' && customFilter) {
      urls = urls.filter(item => item.includes(customFilter))
    }

    return urls
  }

  handleFinish = async (values: IValues): Promise<void> => {
    const { actions } = this.props
    const { fileNameFormat, customFileName } = values
    const urls = this.getUrls(values)

    if (!urls.length) {
      message.error('没有要下载的文件')
      return
    }

    const savePath = ipcRenderer.sendSync('showOpenDialog', {
      properties: ['openDirectory', 'createDirectory'],
    })[0]

    actions!.merge({
      isLoading: true,
    })

    const files = await Promise.all(
      urls.map(async (url, index) => {
        const { extname, filename } = parsePath(url)
        const randomName = randomStr(16)

        const response = await http({
          url,
          responseType: 'stream',
        })
        const requestStream = response.data
        const filePath = path.join(savePath, randomName + extname)

        await once(requestStream.pipe(fs.createWriteStream(filePath)), 'finish')
        const md5 = await md5File(filePath)
        const names: Record<IState['fileNameFormat'], string> = {
          original: filename,
          random: randomName,
          md5,
          custom: substitute(customFileName || '', {
            md5,
            index,
            random: randomName,
          }),
        }

        const newPath = path.join(savePath, names[fileNameFormat] + extname)
        fs.renameSync(filePath, newPath)
        return newPath
      }),
    )

    message.success('下载成功')
    shell.showItemInFolder(files[0])
    actions!.merge({
      isLoading: false,
    })
  }

  render(): ReactElement {
    const { store } = this.props
    const { filterType, fileNameFormat } = this.state

    return (
      <Fragment>
        <Form
          ref={this.formRef}
          {...formItemLayout}
          initialValues={{ filterType: 'none', fileNameFormat: 'original' }}
          onFinish={this.handleFinish}
        >
          <Form.Item label="下载地址" name="input" rules={[{ required: true }]}>
            <Input.TextArea rows={5} placeholder="" />
          </Form.Item>
          <Form.Item label="过滤类型" name="filterType">
            <Radio.Group
              onChange={this.handleRadioChange.bind(this, 'filterType')}
            >
              <Radio value="none">不过滤</Radio>
              <Radio value="image">图片</Radio>
              <Radio value="custom">自定义</Radio>
            </Radio.Group>
          </Form.Item>
          {filterType === 'custom' ? (
            <Form.Item label="自定义过滤" name="customFilter">
              <Input placeholder="" />
            </Form.Item>
          ) : null}
          <Form.Item label="文件名格式" name="fileNameFormat">
            <Radio.Group
              onChange={this.handleRadioChange.bind(this, 'fileNameFormat')}
            >
              <Radio value="original">原始文件名</Radio>
              <Radio value="random">随机</Radio>
              <Radio value="md5">md5</Radio>
              <Radio value="custom">自定义</Radio>
            </Radio.Group>
          </Form.Item>
          {fileNameFormat === 'custom' ? (
            <Form.Item label="自定义文件名" name="customFileName">
              <Input placeholder="可使用index/md5/random占位符" />
            </Form.Item>
          ) : null}
          <Form.Item {...tailFormItemLayout}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={store!.isLoading}
              >
                下载
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Fragment>
    )
  }
}
