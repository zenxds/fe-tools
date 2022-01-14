declare namespace CryptoCommon {
  /** mobx */

  type Store = import('./store').Store
  type Actions = import('./actions').Actions

  interface CommonProps {
    store: Store,
    actions: Actions
  }

  interface IParams {
    type: 'md5' | 'sha1'
  }
}
