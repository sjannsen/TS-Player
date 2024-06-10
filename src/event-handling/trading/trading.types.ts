export type TradableType = 'ITEM' | 'UPGRADE' | 'RESTORATION' | 'RESOURCE'

export type TradablePrice = {
  name: string
  price: number
  type: TradableType
}
