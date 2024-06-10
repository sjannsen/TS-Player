import { ItemData, ItemType } from '../model/item'

export type ItemsDatabase = {
  findItem: (name: string, roundNumber: number) => Promise<ItemData | null>
  findAllByRoundNumber: (roundNumber: number) => Promise<ItemData[]>
  findAllByType: ({ type, roundNumber }: { type: ItemType; roundNumber: number }) => Promise<ItemData[]>
  insert: ({ itemData, roundNumber }: { itemData: ItemData; roundNumber: number }) => Promise<ItemData>
}
