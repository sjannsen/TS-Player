import { closeConnectionToNeo4j } from '../../../../../../db/neo4j-connection'
import eventBus from '../../../../../../event-handling/event-bus'
import logger from '../../../../../../utils/logger'
import bankAccountService from '../../../domain/use-cases'

export default function setUpTradingEventListeners() {
  eventBus.subscribe('BankAccountInitialized', ({ event, playerContext }) => {
    if (event.payload.playerId !== playerContext.playerId) return
    logger.info({ event: event.payload }, 'Initialize bank account')
    bankAccountService.createBankAccount({ initialBalance: event.payload.balance })
  })

  eventBus.subscribe('BankAccountTransactionBooked', ({ event, playerContext }) => {
    if (event.payload.playerId !== playerContext.playerId) return
    logger.info('Transaction has been booked')

    const transactionAmount = event.payload.transactionAmount
    if (transactionAmount < 0) bankAccountService.withdrawMoney({ amount: Math.abs(transactionAmount) })
    else bankAccountService.depositMoney({ amount: transactionAmount })

    const balance = bankAccountService.getBalance().getAmount()
    logger.info({ balance: event.payload.balance, actualBalance: balance }, 'New balance should be')
  })

  eventBus.subscribe('BankAccountCleared', ({ event }) => {
    logger.info({ endBalance: event.payload.balance }, 'BankAccount has been cleared')
    closeConnectionToNeo4j() // TODO: This is not optimal and will be redone
  })
}
