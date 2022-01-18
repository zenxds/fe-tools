import { observable } from 'mobx'

export class Store {
  @observable isLoading = false
}

export default new Store()
