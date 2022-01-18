import BaseActions from '@components/BaseActions'
import store, { Store } from '../store'

export class Actions extends BaseActions<Store> {}
export default new Actions(store)
