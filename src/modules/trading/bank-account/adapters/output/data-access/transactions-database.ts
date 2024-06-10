import { Db } from 'mongodb'
import { getCurrentGameId } from '../../../../../game/current-game'
import { Transaction, TransactionType } from '../../../domain/model/bankAccount'

type MakeBankAccountsDatabaseProps = {
  makeDb: () => Promise<Db>
}

type TransactionSchema = Omit<Transaction, 'id'> & { gameId: string; _id: string }

export default function makeTransactionsDatabase({ makeDb }: MakeBankAccountsDatabaseProps) {
  return Object.freeze({
    insert,
    findAll,
    findById,
    findAllByRoundNumber,
    findAllByType,
  })

  async function insert(transaction: Transaction): Promise<Transaction> {
    const db = await makeDb()

    const gameId = getCurrentGameId()
    if (!gameId) throw new Error(`Cannot findAll transactions. GameId is undefined: ${gameId}`)

    const { amount, round, time, type } = transaction
    const result = await db
      .collection<TransactionSchema>('transactions')
      .insertOne({ _id: transaction.id, gameId, amount, round, time, type })

    const { insertedId } = result
    return { ...transaction, id: insertedId }
  }

  async function findAll(): Promise<Transaction[]> {
    const db = await makeDb()

    const gameId = getCurrentGameId()
    if (!gameId) throw new Error(`Cannot findAll transactions. GameId is undefined: ${gameId}`)

    const result = await db.collection<TransactionSchema>('transactions').find({ gameId }).toArray()

    return result.map(({ _id, ...found }) => ({ id: _id, ...found }))
  }

  async function findById(id: string): Promise<Transaction | null> {
    const db = await makeDb()

    const gameId = getCurrentGameId()
    if (!gameId) throw new Error(`Cannot findAll transactions. GameId is undefined: ${gameId}`)

    const result = await db.collection<TransactionSchema>('transactions').findOne({ _id: id })
    if (!result) return null

    const { amount, round, time, type } = result
    return { id, amount, round, time, type }
  }

  async function findAllByRoundNumber(roundNumber: number): Promise<Transaction[]> {
    const db = await makeDb()

    const gameId = getCurrentGameId()
    if (!gameId) throw new Error(`Cannot findAll transactions. GameId is undefined: ${gameId}`)

    const result = await db.collection<TransactionSchema>('transactions').find({ gameId, round: roundNumber }).toArray()

    return result.map(({ _id, ...found }) => ({ id: _id, ...found }))
  }

  async function findAllByType(type: TransactionType): Promise<Transaction[]> {
    const db = await makeDb()

    const gameId = getCurrentGameId()
    if (!gameId) throw new Error(`Cannot findAll transactions. GameId is undefined: ${gameId}`)

    const result = await db.collection<TransactionSchema>('transactions').find({ gameId, type }).toArray()

    return result.map(({ _id, ...found }) => ({ id: _id, ...found }))
  }
}
