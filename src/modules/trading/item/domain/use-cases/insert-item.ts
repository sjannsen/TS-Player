import logger from '../../../../../utils/logger'
import { getCurrentRoundNumber } from '../../../../game/roundStatus'
import makeItem, { ItemData } from '../model/item'
import { ItemsDatabase } from './data-access'

type InsertItemDependencies = {
  itemDatabase: ItemsDatabase
}

type InsertItemProps = {
  itemData: ItemData
}

export default function makeInsertItem({ itemDatabase }: InsertItemDependencies) {
  return async function insertItem({ itemData }: InsertItemProps) {
    const currentRoundNumber = getCurrentRoundNumber()

    if (!currentRoundNumber) {
      logger.error({ itemData, currentRoundNumber }, 'Cannot insert Item, currentRoundNumber is undefined')
      throw new Error('CurrentRoundNumber is undefined')
    }

    const existing = await itemDatabase.findItem(itemData.name, currentRoundNumber)
    if (existing) return existing

    const item = makeItem({ roundNumber: currentRoundNumber, ...itemData })

    const inserted = await itemDatabase.insert({
      itemData: { type: item.getType(), name: item.getName(), price: item.getPrice() },
      roundNumber: item.getRoundNumber(),
    })

    return inserted
  }
}
