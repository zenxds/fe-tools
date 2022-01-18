import React from 'react'
import JSONStore from '@utils/JSONStore'

declare global {
  type IReactComponent<P = any> = React.ComponentClass<P> | React.ClassicComponentClass<P>

  interface GenericFunc<T> {
    (...args: any[]): T
  }

  interface CommonProps {
    dataStore: JSONStore
  }
}
