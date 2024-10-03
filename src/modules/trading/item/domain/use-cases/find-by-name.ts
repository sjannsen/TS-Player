import logger from '../../../../../utils/logger'
import { getCurrentRoundNumber } from '../../../../game/roundStatus'
import { ItemsDatabase } from './data-access'

type FindByNameDependencies = {
  itemDatabase: ItemsDatabase
}

type FindByNameProps = {
  name: string
}

export default function makeFindByName({ itemDatabase }: FindByNameDependencies) {
  return async function findByName({ name }: FindByNameProps) {
    const currentRoundNumber = getCurrentRoundNumber()

    if (!currentRoundNumber) {
      logger.error({ name, currentRoundNumber }, 'Cannot find item by name, currentRoundNumber is undefined')
      throw new Error('CurrentRoundNumber is undefined')
    }

    return await itemDatabase.findByName({ name, roundNumber: currentRoundNumber })
  }
}
