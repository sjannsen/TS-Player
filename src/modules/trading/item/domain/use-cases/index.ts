import itemsDatabase from '../../adapters/output/data-access'
import makeFindByName from './find-by-name'
import makeInsertItem from './insert-item'
import makeListItems from './list-items'

const inserItem = makeInsertItem({ itemDatabase: itemsDatabase })
const listItems = makeListItems({ itemDatabase: itemsDatabase })
const findByName = makeFindByName({ itemDatabase: itemsDatabase })

const itemService = Object.freeze({
  inserItem,
  listItems,
  findByName
})

export default itemService
export { inserItem, listItems, findByName }
