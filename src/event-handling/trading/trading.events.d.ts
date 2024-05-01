type BankAccountClearedEvent = {
  playerId: string
  balance: number
}

type BankAccountInitializedEvent = {
  playerId: string
  balance: number
}

type BankAccountTransactionBookedEvent = {
  playerId: string
  transactionAmount: number
  balance: number
}

type TradablePricesEvent = Array<TradablePrice>

type TradableSoldEvent = {
  playerId: string
  robotId: string
  type: TradableType
  name: string
  amount: number
  pricePerUnit: number
  totalPrice: number
}

type TradableBoughtEvent = {
  playerId: string
  robotId: string
  type: TradableType
  name: string
  amount: number
  pricePerUnit: number
  totalPrice: number
}
