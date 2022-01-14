import React, { Component, ReactElement } from 'react'
import { observer, inject } from 'mobx-react'
import { RouteComponentProps } from 'react-router-dom'

import * as decorators from '@decorators'

import Form from './components/Form'
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
        <Form type={params.type} />
      </div>
    )
  }
}
