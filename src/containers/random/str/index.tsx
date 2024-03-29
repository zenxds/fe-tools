import React, { Component, ReactElement } from 'react'
import { observer, inject } from 'mobx-react'
import { Tabs } from 'antd'

import * as decorators from '@decorators'

import Form from './components/Form'
import FormReg from './components/FormReg'
import actions from './actions'
import store from './store'
import './less/styles.less'

@decorators.provider({
  actions,
  store
})
@inject('store', 'actions')
@observer
export default class Page extends Component<RandomStr.CommonProps> {
  render(): ReactElement {
    return (
      <div className="container">
        <Tabs defaultActiveKey="length" type="card">
          <Tabs.TabPane tab="长度" key="length">
            <Form />
          </Tabs.TabPane>
          <Tabs.TabPane tab="正则" key="reg">
            <FormReg />
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}
