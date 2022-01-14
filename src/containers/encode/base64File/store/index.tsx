import { observable } from 'mobx'

export class Store {
  @observable isLoading = false
  @observable output = ''
}

export default new Store()
