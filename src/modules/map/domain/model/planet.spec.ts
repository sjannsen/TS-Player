import makePlanet, { Id } from '.'
import { NeighborPlanets, Planet, PlanetResource } from './planet'
import { PlanetExceedsCurrentResourceError, PlanetInvalidArgumentError } from './planet.erros'

describe('makePlanet', () => {
  const resource: PlanetResource = { type: 'COAL', currentAmount: 100, maxAmount: 100 }

  it('creates a planet', () => {
    const planet = makePlanet({ mapServiceId: 'mapId', x: 0, y: 0, movementDifficulty: 1, resource })

    expect(planet.getMapServiceId()).toBe('mapId')
    expect(planet.getCoordinates()).toStrictEqual({ x: 0, y: 0 })
    expect(planet.getMovementDifficulty()).toBe(1)
    expect(planet.getResource()).toBe(resource)
    expect(planet.getNeighborPlanets()).toEqual({
      NORTH: undefined,
      EAST: undefined,
      SOUTH: undefined,
      WEST: undefined,
    })
  })

  it('creates a planet with a neighbor planet', () => {
    const neighborPlanet = makePlanet({ mapServiceId: 'mapId', x: 0, y: 0, movementDifficulty: 1, resource })
    const neighborPlanets: NeighborPlanets = {
      NORTH: neighborPlanet.getId(),
      EAST: undefined,
      SOUTH: undefined,
      WEST: undefined,
    }

    const planet = makePlanet({ mapServiceId: 'mapId', x: 0, y: 0, movementDifficulty: 1, resource, neighborPlanets })

    expect(planet.getMapServiceId()).toBe('mapId')
    expect(planet.getCoordinates()).toStrictEqual({ x: 0, y: 0 })
    expect(planet.getMovementDifficulty()).toBe(1)
    expect(planet.getResource()).toBe(resource)
    expect(planet.getNeighborPlanets()).toEqual(neighborPlanets)
  })

  it('creates a planet with multiple neighbor planets', () => {
    const neighborPlanet = makePlanet({ mapServiceId: 'mapId', x: 0, y: 0, movementDifficulty: 1, resource })
    const neighborPlanet2 = makePlanet({ mapServiceId: 'mapId', x: 0, y: 0, movementDifficulty: 2, resource })
    const neighborPlanet3 = makePlanet({ mapServiceId: 'mapId', x: 0, y: 0, movementDifficulty: 3, resource })
    const neighborPlanet4 = makePlanet({ mapServiceId: 'mapId', x: 0, y: 0, movementDifficulty: 1, resource })
    const neighborPlanets: NeighborPlanets = {
      NORTH: neighborPlanet.getId(),
      EAST: neighborPlanet2.getId(),
      SOUTH: neighborPlanet3.getId(),
      WEST: neighborPlanet4.getId(),
    }

    const planet = makePlanet({ mapServiceId: 'mapId', x: 0, y: 0, movementDifficulty: 1, resource, neighborPlanets })

    expect(planet.getMapServiceId()).toBe('mapId')
    expect(planet.getCoordinates()).toStrictEqual({ x: 0, y: 0 })
    expect(planet.getMovementDifficulty()).toBe(1)
    expect(planet.getResource()).toBe(resource)
    expect(planet.getNeighborPlanets()).toEqual(neighborPlanets)
  })

  it('throws an error, if the planetId is invalid', () => {
    expect(() =>
      makePlanet({ id: 'invalidId', mapServiceId: 'mapId', x: 0, y: 0, movementDifficulty: 1, resource })
    ).toThrow(PlanetInvalidArgumentError)
  })

  it('throws an error, if the mapId is invalid', () => {
    const id = Id.makeId()
    expect(() => makePlanet({ id, mapServiceId: '', x: 0, y: 0, movementDifficulty: 1, resource })).toThrow(
      PlanetInvalidArgumentError
    )
  })

  it('throws an error, if the x coordinate is invalid', () => {
    const id = Id.makeId()
    expect(() => makePlanet({ id, mapServiceId: 'mapId', x: -10, y: 0, movementDifficulty: 1, resource })).toThrow(
      PlanetInvalidArgumentError
    )
  })

  it('throws an error, if the y coordinate is invalid', () => {
    const id = Id.makeId()
    expect(() => makePlanet({ id, mapServiceId: 'mapId', x: 0, y: -10, movementDifficulty: 1, resource })).toThrow(
      PlanetInvalidArgumentError
    )
  })

  it('throws an error, if the movement difficulty is out of bounds because it exceeds the lower limit', () => {
    const id = Id.makeId()
    expect(() => makePlanet({ id, mapServiceId: 'mapId', x: 0, y: 0, movementDifficulty: -10, resource })).toThrow(
      PlanetInvalidArgumentError
    )
  })

  it('throws an error, if the movement difficulty is is out of bounds because it is 0', () => {
    const id = Id.makeId()
    expect(() => makePlanet({ id, mapServiceId: 'mapId', x: 0, y: 0, movementDifficulty: 0, resource })).toThrow(
      PlanetInvalidArgumentError
    )
  })

  it('throws an error, if the movement difficulty is is out of bounds because it exceeds the upper limit', () => {
    const id = Id.makeId()
    expect(() => makePlanet({ id, mapServiceId: 'mapId', x: 0, y: 0, movementDifficulty: 10, resource })).toThrow(
      PlanetInvalidArgumentError
    )
  })
})

describe('mineResource', () => {
  let resource: PlanetResource
  let planet: Planet

  beforeEach(() => {
    resource = { type: 'COAL', currentAmount: 100, maxAmount: 100 }
    planet = makePlanet({ mapServiceId: 'mapId', x: 0, y: 0, movementDifficulty: 1, resource })
  })

  it('reduces the amount of the resource on a planet', () => {
    planet.mineResource(10)
    expect(planet.getResource()?.currentAmount).toBe(90)
  })

  it('reduces the amount of the resource on a planet until 0', () => {
    planet.mineResource(100)
    expect(planet.getResource()?.currentAmount).toBe(0)
  })

  it('throws an error, if the amount to mine is negative', () => {
    expect(() => planet.mineResource(-10)).toThrow(PlanetInvalidArgumentError)
  })

  it('throws an error, if the amount to mine exceeds the current amount on the planet', () => {
    expect(() => planet.mineResource(500)).toThrow(PlanetExceedsCurrentResourceError)
  })
})
