import { TradablePrice, TradableType } from './trading.types'

export type BankAccountClearedEvent = {
  playerId: string
  balance: number
}

export type BankAccountInitializedEvent = {
  playerId: string
  balance: number
}

export type BankAccountTransactionBookedEvent = {
  playerId: string
  transactionAmount: number
  balance: number
}

export type TradablePricesEvent = Array<TradablePrice>

export type TradableSoldEvent = {
  playerId: string
  robotId: string
  type: TradableType
  name: string
  amount: number
  pricePerUnit: number
  totalPrice: number
}

export type TradableBoughtEvent = {
  playerId: string
  robotId: string
  type: TradableType
  name: string
  amount: number
  pricePerUnit: number
  totalPrice: number
}
