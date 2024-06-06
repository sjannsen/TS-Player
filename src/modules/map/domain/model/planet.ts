import { ResourceType } from '../../../../shared/types'
import {
  PlanetExceedsCurrentResourceError,
  PlanetInvalidArgumentError,
  PlanetNotAllowedOperationError,
} from './planet.erros'

export type PlanetResource = {
  type: ResourceType
  maxAmount: number
  currentAmount: number
}

export type NeighborPlanets = {
  NORTH: string | undefined
  EAST: string | undefined
  SOUTH: string | undefined
  WEST: string | undefined
}

export type Planet = {
  getId: () => string
  getMapServiceId: () => string
  getCoordinates: () => { x: number | undefined; y: number | undefined }
  getMovementDifficulty: () => number
  getResource: () => PlanetResource | undefined
  getNeighborPlanets: () => NeighborPlanets
  mineResource: (amount: number) => void
}

export type Id = {
  makeId: () => string
  isValidId: (id: string) => boolean
}

type MakePlanetDependencies = {
  Id: Id
}

export type PlanetData = {
  id?: string
  mapServiceId: string
  x?: number
  y?: number
  movementDifficulty: number
  resource?: PlanetResource
  neighborPlanets?: NeighborPlanets
}

export default function buildMakePlanet({ Id }: MakePlanetDependencies) {
  return function makePlanet({
    id = Id.makeId(),
    mapServiceId,
    x,
    y,
    movementDifficulty,
    resource,
    neighborPlanets = { NORTH: undefined, EAST: undefined, SOUTH: undefined, WEST: undefined },
  }: PlanetData): Planet {
    const ID_INVALID_ERROR = `The Id: ${id} is invalid`
    const MAP_SERVICE_ID_INVALID_ERROR = `The mapServiceId: ${mapServiceId} is invalid`
    const X_NEGATIVE_ERROR = `The x-coordinate: ${x} is negative`
    const Y_NEGATIVE_ERROR = `The y-coordinate: ${y} is negative`
    const MOVEMENT_DIFFICULTY_NEGATIVE_ERROR = `The movementDifficulty: ${movementDifficulty} is negative`
    const MOVEMENT_DIFFICULTY_EXCEEDING_LIMIT_ERROR = `The movementDifficulty: ${movementDifficulty} exceeds the limit`

    if (!Id.isValidId(id)) throw new PlanetInvalidArgumentError(ID_INVALID_ERROR)
    if (!mapServiceId) throw new PlanetInvalidArgumentError(MAP_SERVICE_ID_INVALID_ERROR)
    if (x && x < 0) throw new PlanetInvalidArgumentError(X_NEGATIVE_ERROR)
    if (y && y < 0) throw new PlanetInvalidArgumentError(Y_NEGATIVE_ERROR)
    if (movementDifficulty <= 0) throw new PlanetInvalidArgumentError(MOVEMENT_DIFFICULTY_NEGATIVE_ERROR)
    if (movementDifficulty > 3) throw new PlanetInvalidArgumentError(MOVEMENT_DIFFICULTY_EXCEEDING_LIMIT_ERROR)

    const resourceState = resource

    const mineResource = (amount: number) => {
      const NOT_ALLOWED_MINE_ERROR = `The planet has no resource to mine`
      const MINING_AMOUNT_NEGATIVE_ERROR = `The amountToMine: ${amount} is negative`
      const MINING_AMOUNT_EXCEEDING_LIMIT_ERROR = `The amountToMine: ${amount} exceeds the planet resources: ${resourceState?.currentAmount}`

      if (!resourceState) throw new PlanetNotAllowedOperationError(NOT_ALLOWED_MINE_ERROR)
      if (amount < 0) throw new PlanetInvalidArgumentError(MINING_AMOUNT_NEGATIVE_ERROR)
      if (amount > resourceState.currentAmount)
        throw new PlanetExceedsCurrentResourceError(MINING_AMOUNT_EXCEEDING_LIMIT_ERROR)

      resourceState.currentAmount -= amount
    }

    return Object.freeze({
      getId: () => id,
      getMapServiceId: () => mapServiceId,
      getCoordinates: () => ({ x, y }) ?? undefined,
      getMovementDifficulty: () => movementDifficulty,
      getResource: () => resourceState,
      getNeighborPlanets: () => neighborPlanets,
      mineResource,
    })
  }
}
