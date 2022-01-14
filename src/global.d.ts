import React from 'react'
import JSONStore from '@utils/JSONStore'

declare global {
  type IReactComponent<P = any> = React.ComponentClass<P> | React.ClassicComponentClass<P>

  interface LooseObject {
    [key: string]: any
  }

  interface Dictionary<T> {
    [key: string]: T
  }

  interface GenericFunc<T> {
    (...args: any[]): T
  }

  interface CommonProps {
    dataStore: JSONStore
  }
}
