import { Db } from 'mongodb'
import { InventoryData } from '../../../domain/model/inventory'
import { getCurrentGameId } from '../../../../../game'
import Id from '../../../domain/Id'

type MakeInventoriesDatabaseProps = {
  makeDb: () => Promise<Db>
}

type InventorySchema = Omit<InventoryData, 'id'> & { _id: string; gameId: string }

export default function makeMakeInventoriesDatabase({ makeDb }: MakeInventoriesDatabaseProps) {
  return Object.freeze({
    findAll,
    findById,
    insert,
    update,
  })

  async function findAll(): Promise<InventoryData[]> {
    const db = await makeDb()
    const gameId = getCurrentGameId()
    if (!gameId) throw new Error(`Cannot findAll inventories. GameId is undefined: ${gameId}`)

    const result = await db.collection<InventorySchema>('inventories').find().toArray()

    return result.map(({ _id, ...found }) => ({ id: _id, ...found }))
  }

  async function findById({ id: inventoryId }: { id: string }): Promise<InventoryData | null> {
    const db = await makeDb()
    const gameId = getCurrentGameId()
    if (!gameId) throw new Error(`Cannot findAll inventories. GameId is undefined: ${gameId}`)

    const result = await db.collection<InventorySchema>('inventories').findOne({ _id: inventoryId })
    if (!result) return result

    const { _id: id, ...inventoryData } = result

    return { id, ...inventoryData }
  }

  async function insert({ id, ...inventoryData }: InventoryData): Promise<InventoryData> {
    const db = await makeDb()
    const gameId = getCurrentGameId()
    if (!gameId) throw new Error(`Cannot findAll inventories. GameId is undefined: ${gameId}`)

    if (!id) id = Id.makeId()

    const result = await db.collection<InventorySchema>('inventories').insertOne({ _id: id, gameId, ...inventoryData })

    const { insertedId } = result

    return { id: insertedId, ...inventoryData }
  }

  async function update({ id, ...inventoryData }: Partial<InventoryData>): Promise<Partial<InventoryData> | null> {
    const db = await makeDb()
    const gameId = getCurrentGameId()
    if (!gameId) throw new Error(`Cannot findAll inventories. GameId is undefined: ${gameId}`)

    const result = await db
      .collection<InventorySchema>('inventories')
      .updateOne({ _id: id, gameId }, { $set: { ...inventoryData } })

    return result.modifiedCount == 1 ? { ...inventoryData } : null
  }
}
