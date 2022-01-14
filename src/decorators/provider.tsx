import React, { Component, ReactElement } from 'react'
import { Provider } from 'mobx-react'

export function provider(injectData: any = {}): (arg: IReactComponent) => any {
  return (WrappedComponent: IReactComponent): any => {
    class InjectedComponent extends Component {
      render(): ReactElement {
        const { children, ...otherProps } = this.props

        return (
          <Provider {...injectData}>
            <WrappedComponent {...otherProps} />
          </Provider>
        )
      }
    }

    return InjectedComponent
  }
}
