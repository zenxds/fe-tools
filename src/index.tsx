/**
 * 入口
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { configure } from 'mobx'
import { Provider } from 'mobx-react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

import App from './app'
import injects from './inject'

// 不允许在动作外部修改状态
configure({ enforceActions: 'always' })

ReactDOM.render(
  <Provider {...injects}>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </Provider>,
  document.getElementById('app')
)
