declare namespace FormatColor {
  /** mobx */

  type Store = import('./store').Store
  type Actions = import('./actions').Actions

  interface CommonProps {
    store?: Store,
    actions?: Actions
  }

  type ColorType = 'hex' | 'rgb' | 'hsl'
}
