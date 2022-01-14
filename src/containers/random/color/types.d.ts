declare namespace RandomColor {
  /** mobx */

  type Store = import('./store').Store
  type Actions = import('./actions').Actions

  interface CommonProps {
    store: Store,
    actions: Actions
  }
}
