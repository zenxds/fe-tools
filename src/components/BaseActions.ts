import { action } from 'mobx'

export default class Actions<T> {
  store: T

  constructor(store: T) {
    this.store = store
  }

  @action.bound
  public merge(obj: Partial<T> = {}): T {
    return Object.assign(this.store, obj)
  }
}
