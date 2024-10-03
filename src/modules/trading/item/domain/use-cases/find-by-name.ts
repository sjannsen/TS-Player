import logger from '../../../../../utils/logger'
import { getCurrentRoundNumber } from '../../../../game/roundStatus'
import { ItemsDatabase } from './data-access'

type FindByNameDependencies = {
  itemDatabase: ItemsDatabase
}

type FindByNameProps = {
  itemName: string
}

export default function makeFindByName({ itemDatabase }: FindByNameDependencies) {
  return async function findByName({ itemName }: FindByNameProps) {
    const currentRoundNumber = getCurrentRoundNumber()

    if (!currentRoundNumber) {
      logger.error({ itemName, currentRoundNumber }, 'Cannot find item by name, currentRoundNumber is undefined')
      throw new Error('CurrentRoundNumber is undefined')
    }

    return await itemDatabase.findByName({ itemName, roundNumber: currentRoundNumber })
  }
}
