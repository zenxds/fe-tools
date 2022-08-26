import React, { Component, ReactElement } from 'react'
import { observer, inject } from 'mobx-react'
import { RouteComponentProps } from 'react-router-dom'
import { Tabs } from 'antd'

import * as decorators from '@decorators'

import Form from './components/Form'
import FormFile from './components/FormFile'
import actions from './actions'
import store from './store'
import './less/styles.less'

@decorators.provider({
  actions,
  store
})
@inject('store', 'actions')
@observer
export default class Page extends Component<CryptoCommon.CommonProps & RouteComponentProps<CryptoCommon.IParams>> {
  render(): ReactElement {
    const { params } = this.props.match

    return (
      <div className="container">
        <Tabs defaultActiveKey="str" type="card">
          <Tabs.TabPane tab="字符串" key="str">
            <Form type={params.type} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="文件" key="file">
            <FormFile type={params.type} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}
