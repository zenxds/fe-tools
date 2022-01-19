import React from 'react'
import DataStore from '@utils/DataStore'

declare global {
  type IReactComponent<P = any> = React.ComponentClass<P> | React.ClassicComponentClass<P>

  interface GenericFunc<T> {
    (...args: any[]): T
  }

  interface CommonProps {
    dataStore: DataStore
  }
}
