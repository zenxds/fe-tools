import React, { Component, ReactElement } from 'react'
import {
  // BrowserRouter as Router
  HashRouter as Router,
  Redirect,
  Switch,
  Route
} from 'react-router-dom'
import { Layout, Spin } from 'antd'
import loadable from '@loadable/component'

import './less/antd.less'
import './less/app.less'
import './update'

import paths, { commonPaths } from '@constants/paths'
import Menu from '@components/Menu'

function load(page: string) {
  return loadable(() => import(`./containers/${page}`), {
    fallback: (
      <Spin>
        <div className="container"></div>
      </Spin>
    ),
  })
}

export default class App extends Component {
  render(): ReactElement {
    return (
      <Router>
        <Layout>
          <Layout.Sider>
            <Menu />
          </Layout.Sider>
          <Layout.Content>
            <Switch>
              <Route path={paths.compressImage} exact component={load('compress/img')} />
              <Route path={paths.randomStr} exact component={load('random/str')} />
              <Route path={paths.randomNum} exact component={load('random/num')} />
              <Route path={commonPaths.crypto} exact component={load('crypto/common')} />
              <Route path={paths.encodeFile} exact component={load('encode/file')} />
              <Route path={commonPaths.encode} exact component={load('encode/common')} />
              <Route path={paths.formatColor} exact component={load('format/color')} />

              <Route path="/" exact>
                <Redirect to={paths.compressImage} />
              </Route>
            </Switch>
          </Layout.Content>
        </Layout>
      </Router>
    )
  }
}
