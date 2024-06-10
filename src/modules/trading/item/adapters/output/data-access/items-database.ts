import { Db } from 'mongodb'
import logger from '../../../../../../utils/logger'
import { getCurrentGameId } from '../../../../../game'
import { ItemData, ItemType } from '../../../domain/model/item'

type MakeItemsDatabaseProps = {
  makeDb: () => Promise<Db>
}

type ItemSchema = ItemData & { gameId: string; roundNumber: number }

export default function makeItemsDatabase({ makeDb }: MakeItemsDatabaseProps) {
  return Object.freeze({ findItem, findAllByRoundNumber, findAllByType, insert })

  async function findItem(name: string, roundNumber: number): Promise<ItemData | null> {
    const db = await makeDb()
    const gameId = getCurrentGameId()
    if (!gameId) {
      logger.error({ gameId }, 'Could not findItem, because gameId is undefied')
      throw new Error('GameId is undefined')
    }
    const result = await db.collection<ItemSchema>('items').findOne({ name, roundNumber, gameId })
    return result ?? null
  }

  async function findAllByRoundNumber(roundNumber: number): Promise<ItemData[]> {
    const db = await makeDb()
    const gameId = getCurrentGameId()
    if (!gameId) {
      logger.error({ gameId }, 'Could not findAllByRoundNumber, because gameId is undefied')
      throw new Error('GameId is undefined')
    }
    const result = await db.collection<ItemSchema>('items').find({ roundNumber, gameId }).toArray()
    return result.map(({ type, name, price }) => ({
      type,
      name,
      price,
    }))
  }

  async function findAllByType({ type, roundNumber }: { type: ItemType; roundNumber: number }): Promise<ItemData[]> {
    const db = await makeDb()
    const gameId = getCurrentGameId()
    if (!gameId) {
      logger.error({ gameId }, 'Could not findAllByType, because gameId is undefied')
      throw new Error('GameId is undefined')
    }
    const result = await db.collection<ItemSchema>('items').find({ type, roundNumber, gameId }).toArray()
    return result.map(({ type, name, price }) => ({
      type,
      name,
      price,
    }))
  }

  async function insert({ itemData, roundNumber }: { itemData: ItemData; roundNumber: number }): Promise<ItemData> {
    const db = await makeDb()
    const gameId = getCurrentGameId()
    if (!gameId) {
      logger.error({ gameId }, 'Could not insert item, because gameId is undefied')
      throw new Error('GameId is undefined')
    }

    const { type, name, price } = itemData
    const result = await db.collection<ItemSchema>('items').insertOne({ type, name, price, roundNumber, gameId })

    return itemData
  }
}
