import { Db } from 'mongodb'
import { getPlayer } from '../../../../../shared/config'
import { getCurrentGameId } from '../../../../game'
import Id from '../../../domain/Id'
import { RobotData } from '../../../domain/models/robot'

type MakeRobotsDatabaseProps = {
  makeDb: () => Promise<Db>
}

type RobotSchema = Omit<RobotData, 'id'> & { _id: string; gameId: string }

export default function makeRobotsDatabase({ makeDb }: MakeRobotsDatabaseProps) {
  return Object.freeze({
    findAll,
    findAllWithZeroEnergy,
    findById,
    insert,
    update,
  })

  async function findAll({ owner }: { owner?: 'Player' | 'Enemy' }): Promise<RobotData[]> {
    const db = await makeDb()

    const playerId = getPlayer().playerId
    if (!playerId) throw new Error(`Cannot findAll robots. PlayerId is undefined: ${playerId}`)

    const gameId = getCurrentGameId()
    if (!gameId) throw new Error(`Cannot findAll robots. GameId is undefined: ${gameId}`)

    let result: RobotSchema[] = []

    if (!owner) result = await db.collection<RobotSchema>('robots').find({ gameId }).toArray()

    if (owner == 'Player')
      result = await db.collection<RobotSchema>('robots').find({ player: playerId, gameId }).toArray()

    if (owner == 'Enemy')
      result = await db
        .collection<RobotSchema>('robots')
        .find({ player: { $ne: playerId }, gameId })
        .toArray()

    return result.map(({ _id, ...found }) => ({ id: _id, ...found }))
  }

  async function findAllWithZeroEnergy(): Promise<RobotData[]> {
    const db = await makeDb()
    const gameId = getCurrentGameId()
    if (!gameId) throw new Error(`Cannot findAll robots. GameId is undefined: ${gameId}`)

    const result = await db
      .collection<RobotSchema>('robots')
      .find({ attributes: { energy: 0 }, gameId })
      .toArray()

    return result.map(({ _id, ...found }) => ({ id: _id, ...found }))
  }

  async function findById({ id, robotServiceId }: { id?: string; robotServiceId?: string }): Promise<RobotData | null> {
    if (!id && !robotServiceId)
      throw new Error(`Cannot find robot by id. Id: ${id} and RobotServiceId: ${robotServiceId} are undefined`)

    const db = await makeDb()
    const currentGameId = getCurrentGameId()
    if (!currentGameId) throw new Error(`Cannot findAll robots. GameId is undefined: ${currentGameId}`)

    const queryCriteria: Partial<RobotSchema> = {}
    if (id) queryCriteria._id = id
    if (robotServiceId) queryCriteria.robotServiceId = robotServiceId

    const result = await db.collection<RobotSchema>('robots').findOne(queryCriteria)

    if (!result) {
      return result
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, gameId, ...robotData } = result
    return { ...robotData }
  }

  async function insert({ robotData }: { robotData: RobotData }): Promise<RobotData> {
    const db = await makeDb()
    const gameId = getCurrentGameId()
    if (!gameId) throw new Error(`Cannot findAll robots. GameId is undefined: ${gameId}`)

    const result = await db
      .collection<RobotSchema>('robots')
      .insertOne({ _id: (robotData.id = Id.makeId()), ...robotData, gameId })

    const { insertedId } = result
    return { id: insertedId, ...robotData }
  }

  async function update({ id, robotServiceId, ...robotData }: Partial<RobotData>): Promise<Partial<RobotData | null>> {
    const db = await makeDb()
    const gameId = getCurrentGameId()
    if (!gameId) throw new Error(`Cannot findAll robots. GameId is undefined: ${gameId}`)

    const queryCriteria: Partial<RobotSchema> = {}
    if (id) queryCriteria._id = id
    if (robotServiceId) queryCriteria.robotServiceId = robotServiceId

    const result = await db.collection<RobotSchema>('robots').updateOne(queryCriteria, { $set: { ...robotData } })

    return result.modifiedCount === 1 ? { ...robotData } : null
  }
}
