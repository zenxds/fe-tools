import React, { Component, Fragment, ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import {
  Form,
  Input,
  Radio,
  Space,
  Button,
  Table,
  Descriptions,
  RadioChangeEvent,
} from 'antd'
import { FormInstance } from 'antd/es/form'
import { ColumnsType } from 'antd/lib/table'

import {
  testProxy,
  testConnect,
  TestResult,
  DNSResult,
  parseServers,
  parseLines,
  resolveDNS,
  formatTime,
  sortResults,
} from '@utils/connect'

import { formItemLayout, tailFormItemLayout } from '@constants'
import '../less/styles.less'

interface IState {
  type: string
  results: TestResult[]
}

interface IValues {
  type: string
  input: string
  proxy?: string
  dns?: string
}

@inject('store', 'actions')
@observer
export default class PageForm extends Component<ConnectTest.CommonProps> {
  formRef = React.createRef<FormInstance>()

  state: IState = {
    type: 'connect',
    results: [],
  }

  handleTypeChange = (e: RadioChangeEvent): void => {
    this.setState({
      type: e.target.value,
      results: [],
    })
  }

  handleFinish = async (values: IValues): Promise<void> => {
    const { actions } = this.props
    const { type, input, proxy, dns } = values
    const servers = parseServers(input)
    const dnsList = dns ? parseLines(dns) : []
    let results: TestResult[] = []

    actions!.merge({
      isLoading: true,
    })

    this.setState({
      results: [],
    })

    if (type === 'dns' && dnsList.length) {
      const { hostname } = servers[0]
      const resolvedList: DNSResult[] = (
        await Promise.all(dnsList.map(dns => resolveDNS(hostname, dns)))
      ).filter(item => !!item.ip)

      results = await Promise.all(
        resolvedList.map(item =>
          testConnect(
            Object.assign({}, servers[0], { hostname: item.ip, dns: item.dns }),
          ),
        ),
      )
    } else {
      results = await Promise.all(
        servers.map(server =>
          proxy ? testProxy(server, proxy) : testConnect(server),
        ),
      )
    }

    actions!.merge({
      isLoading: false,
    })

    this.setState({
      results: sortResults(results),
    })
  }

  renderResults(): ReactElement | null {
    const { results, type } = this.state

    if (!results.length) {
      return null
    }

    if (type === 'dns') {
      const columns: ColumnsType<TestResult> = [
        {
          title: 'DNS',
          dataIndex: 'dns',
        },
        {
          title: 'IP',
          dataIndex: 'hostname',
        },
        {
          title: '结果',
          dataIndex: 'error',
          render: (val, record) => {
            if (record.error) {
              return <span styleName="danger">{record.error}</span>
            }

            return <span styleName="success">{formatTime(record.time)}</span>
          }
        }
      ]

      return (
        <Table
          bordered
          rowKey={item => `${item.dns || item.hostname}:${item.port}`}
          columns={columns}
          dataSource={results}
        />
      )
    }

    return (
      <Descriptions bordered column={1}>
        {results.map(item => {
          return (
            <Descriptions.Item
              key={`${item.dns || item.hostname}:${item.port}`}
              label={
                item.dns ? `${item.dns} 解析结果为 ${item.hostname}` : ` ${item.hostname}:${item.port}`
              }
            >
              {item.error ? (
                <span styleName="danger">{item.error}</span>
              ) : (
                <span styleName="success">{formatTime(item.time)}</span>
              )}
            </Descriptions.Item>
          )
        })}
      </Descriptions>
    )
  }

  render(): ReactElement {
    const { store } = this.props
    const { type } = this.state

    return (
      <Fragment>
        <Form
          ref={this.formRef}
          {...formItemLayout}
          initialValues={{ type: 'connect' }}
          onFinish={this.handleFinish}
        >
          <Form.Item label="类型" name="type" rules={[{ required: true }]}>
            <Radio.Group onChange={this.handleTypeChange}>
              <Radio value="connect">直连</Radio>
              <Radio value="proxy">代理</Radio>
              <Radio value="dns">DNS</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="地址" name="input" rules={[{ required: true }]}>
            {type === 'dns' ? (
              <Input placeholder="" />
            ) : (
              <Input.TextArea rows={5} placeholder={'https://www.a.com'} />
            )}
          </Form.Item>

          {type === 'proxy' && (
            <Form.Item label="代理" name="proxy" rules={[{ required: true }]}>
              <Input placeholder="socks://127.0.0.1:1113" />
            </Form.Item>
          )}

          {type === 'dns' && (
            <Form.Item label="DNS" name="dns" rules={[{ required: true }]}>
              <Input.TextArea rows={5} placeholder={'8.8.8.8'} />
            </Form.Item>
          )}

          <Form.Item {...tailFormItemLayout}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={store!.isLoading}
              >
                测试
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {this.renderResults()}
      </Fragment>
    )
  }
}
