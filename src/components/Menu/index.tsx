import React, { Component, Fragment, ReactElement } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Menu } from 'antd'

import { MenuItem as IMenuItem, menus, parentMap, pathMap  } from './constants'

interface IState {
  openKeys: string[]
}

class AppMenu extends Component<RouteComponentProps, IState> {
  constructor(props: RouteComponentProps) {
    super(props)

    this.state = {
      openKeys: []
    }
  }

  componentDidMount(): void {
    this.setState({
      openKeys: this.getOpenKeys(),
    })
  }

  getCurrentPath = (): string => {
    const { pathname } = this.props.location

    let ret: string = pathname
    pathMap.forEach((item: IMenuItem, key: string) => {
      if (pathname.startsWith(key)) {
        ret = key
      }
    })

    return ret
  }

  // 当前应当打开的菜单
  // 当前路径的父路径都应该打开
  getOpenKeys = (): string[] => {
    const openKeys = []
    const current = pathMap.get(this.getCurrentPath())

    let currentCode = current && current.code
    while (currentCode) {
      openKeys.push(currentCode)
      currentCode = parentMap.get(currentCode)
    }

    return openKeys
  }


  handleClick = (e: any): void => {
    const { pathname } = this.props.location
    const key = e.key

    if (key !== pathname) {
      this.props.history.push(key)
    }
  }

  handleOpenChange = (openKeys: string[]): void => {
    this.setState({
      openKeys
    })
  }

  renderMenu(menus: IMenuItem[] = []): ReactElement[] {
    return menus.map(menu => {
      if (menu.children && menu.children.length) {
        return (
          <Menu.SubMenu
            key={menu.code}
            title={menu.name}
          >
            {this.renderMenu(menu.children)}
          </Menu.SubMenu>
        )
      }

      return (
        <Menu.Item
          title={menu.name}
          key={menu.code}
        >
          {menu.name}
        </Menu.Item>
      )
    })
  }

  render(): ReactElement {
    const { openKeys } = this.state
    const defaultOpenKeys = this.getOpenKeys()

    return (
      <Fragment>
        <Menu
          onClick={this.handleClick}
          onOpenChange={this.handleOpenChange}
          selectedKeys={[defaultOpenKeys[0]]}
          openKeys={openKeys}
          defaultOpenKeys={defaultOpenKeys}
          mode="inline"
          theme="dark"
        >
          {this.renderMenu(menus)}
        </Menu>
      </Fragment>
    )
  }
}

export default withRouter(AppMenu)
