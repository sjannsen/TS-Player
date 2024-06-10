export type ItemData = {
  name: string
  price: number
  type: ItemType
}

type BuildMakeItemProps = {
  roundNumber: number
  name: string
  price: number
  type: ItemType
}

export type ItemType = 'RESOURCE' | 'UPGRADE' | 'RESTORATION' | 'ITEM'

type Item = {
  getName: () => string
  getPrice: () => number
  getType: () => ItemType
  getRoundNumber: () => number
}

export default function makeItem({ roundNumber, name, price, type }: BuildMakeItemProps): Item {
  return Object.freeze({
    getName: () => name,
    getPrice: () => price,
    getType: () => type,
    getRoundNumber: () => roundNumber,
  })
}
