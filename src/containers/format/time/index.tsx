import React, { Component, ReactElement } from 'react'
import { observer, inject } from 'mobx-react'

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
export default class Page extends Component<FormatTime.CommonProps> {
  render(): ReactElement {
    return (
      <div className="container">
        <Form />
      </div>
    )
  }
}
