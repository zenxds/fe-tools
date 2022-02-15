declare namespace CryptoCommon {
  /** mobx */

  type Store = import('./store').Store
  type Actions = import('./actions').Actions

  interface CommonProps {
    store?: Store,
    actions?: Actions
  }

  type CryptoTypes = 'md5' | 'sha1'

  interface IParams {
    type: CryptoTypes
  }
}
