type TradableType = 'ITEM' | 'UPGRADE' | 'RESTORATION' | 'RESOURCE'

type TradablePrice = {
  name: string
  price: number
  type: TradableType
}
