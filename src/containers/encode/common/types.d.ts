declare namespace EncodeCommon {
  /** mobx */

  type Store = import('./store').Store
  type Actions = import('./actions').Actions

  interface CommonProps {
    store?: Store,
    actions?: Actions
  }

  type EncodeTypes = 'base64' | 'utf8' | 'unicode' | 'buffer' | 'uri' | 'uriComponent'

  interface IParams {
    type: EncodeTypes
  }
}
