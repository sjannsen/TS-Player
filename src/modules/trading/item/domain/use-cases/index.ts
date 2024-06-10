import itemsDatabase from '../../adapters/output/data-access'
import makeInsertItem from './insert-item'
import makeListItems from './list-items'

const inserItem = makeInsertItem({ itemDatabase: itemsDatabase })
const listItems = makeListItems({ itemDatabase: itemsDatabase })

const itemService = Object.freeze({
  inserItem,
  listItems,
})

export default itemService
export { inserItem, listItems }
