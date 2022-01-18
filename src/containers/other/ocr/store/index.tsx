import { observable } from 'mobx'

export class Store {
  @observable isLoading = false
  @observable output = ''
  @observable showSettingModal = false
}

export default new Store()
