import { PlanetExceedsCurrentResourceError, PlanetInvalidArgumentError } from './planet.erros'

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
  getX: () => number
  getY: () => number
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

type MakePlanetProps = {
  id?: string
  mapServiceId: string
  x: number
  y: number
  movementDifficulty: number
  resource: PlanetResource
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
  }: MakePlanetProps): Planet {
    if (!Id.isValidId(id)) throw new PlanetInvalidArgumentError(`The planetId is invalid: ${id}`)
    if (!mapServiceId) throw new PlanetInvalidArgumentError(`The mapServiceId is invalid: ${mapServiceId}`)
    if (x < 0) throw new PlanetInvalidArgumentError(`The x coordinate must not be negative: ${x}`)
    if (y < 0) throw new PlanetInvalidArgumentError(`The x coordinate must not be negative: ${y}`)
    if (movementDifficulty <= 0)
      throw new PlanetInvalidArgumentError(`The movement difficulty must not be negative: ${movementDifficulty}`)
    if (movementDifficulty > 3)
      throw new PlanetInvalidArgumentError(`The movement difficulty must be smaller than: ${movementDifficulty}`)

    const resourceState = resource

    const mineResource = (amount: number) => {
      if (amount < 0) throw new PlanetInvalidArgumentError(`Amount to mine must not be negative: ${amount}`)
      if (amount > resourceState.currentAmount)
        throw new PlanetExceedsCurrentResourceError(
          `Amount to mine: ${amount} exceeds current amount: ${resourceState.currentAmount}`
        )
      resourceState.currentAmount -= amount
    }

    return Object.freeze({
      getId: () => id,
      getMapServiceId: () => mapServiceId,
      getX: () => x,
      getY: () => y,
      getMovementDifficulty: () => movementDifficulty,
      getResource: () => resourceState,
      getNeighborPlanets: () => neighborPlanets,
      mineResource,
    })
  }
}
