import logger from '../../../../../utils/logger'
import { getCurrentRoundNumber } from '../../../../game/roundStatus'
import { ItemType } from '../model/item'
import { ItemsDatabase } from './data-access'

type ListItemsDependencies = {
  itemDatabase: ItemsDatabase
}

type ListItemsProps = {
  type?: ItemType
}

export default function makeListItems({ itemDatabase }: ListItemsDependencies) {
  return async function listItems({ type }: ListItemsProps) {
    const currentRoundNumber = getCurrentRoundNumber()

    if (!currentRoundNumber) {
      logger.error({ type, currentRoundNumber }, 'Cannot insert Item, currentRoundNumber is undefined')
      throw new Error('CurrentRoundNumber is undefined')
    }

    if (type) return await itemDatabase.findAllByType({ type, roundNumber: currentRoundNumber })
    return await itemDatabase.findAllByRoundNumber(currentRoundNumber)
  }
}
