export type BuyTradableCommandData = {
  robotId: string | null
  itemName: string
  itemQuantity: number
}

export type MineCommandData = {
  robotId: string
}

export type MoveCommandData = {
  robotId: string
  planetId: string
}

export type RegenerateCommandData = {
  robotId: string
}

export type SellTradablesCommandData = {
  robotId: string
}

export type CommandType = 'mining' | 'movement' | 'battle' | 'buying' | 'selling' | 'regenerate'

export type CommandData =
  | BattleCommandData
  | BuyTradableCommandData
  | MineCommandData
  | MoveCommandData
  | RegenerateCommandData
  | SellTradablesCommandData

type Command<K extends CommandType, T extends CommandData> = {
  playerId: string
  type: K
  data: T
}

export type BattleCommandData = {
  robotId: string
  targetId: string
}

export type BattleCommand = Command<'battle', BattleCommandData>

export type BuyTradableCommand = Command<'buying', BuyTradableCommandData>

export type MineCommand = Command<'mining', MineCommandData>

export type MoveCommand = Command<'movement', MoveCommandData>

export type RegenerateCommand = Command<'regeneration', RegenerateCommandData>

export type SellTradablesCommand = Command<'selling', SellTradablesCommandData>

export type GameCommand =
  | BattleCommand
  | BuyTradableCommand
  | MineCommand
  | MoveCommand
  | RegenerateCommand
  | SellTradablesCommand
