declare namespace FormatNumber {
  /** mobx */

  type Store = import('./store').Store
  type Actions = import('./actions').Actions

  interface CommonProps {
    store?: Store,
    actions?: Actions
  }

  type NumberType = '2' | '8' | '10' | '16'
}
