import { observable } from 'mobx'

export class Store {
  @observable isLoading = false
  @observable height = ''
}

export default new Store()
