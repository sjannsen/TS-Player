import Id from '../Id'
import makeCreatePlanet from './create-planet'
import { MockPlanetDb, clearMockPlanetDb, mockPlanet, mockPlanetDb, mockPlanetResource } from './mocks/mock'

describe('createPlanet', () => {
  let planetDb: MockPlanetDb
  let createPlanet: ReturnType<typeof makeCreatePlanet>

  beforeEach(() => {
    clearMockPlanetDb()

    planetDb = mockPlanetDb
    createPlanet = makeCreatePlanet({ planetDb })
  })

  it('creates a planet and calls data access layer', async () => {
    await createPlanet({
      id: Id.makeId(),
      mapServiceId: 'newMapId',
      x: 0,
      y: 0,
      movementDifficulty: 1,
      resource: mockPlanetResource,
      neighborPlanets: {
        NORTH: 'mapId1',
        EAST: 'mapId2',
        SOUTH: 'mapId3',
        WEST: 'mapId4',
      },
    })

    expect(planetDb.findById.mock.calls.length).toBe(1)
    expect(planetDb.insert.mock.calls.length).toBe(1)
  })

  it('returns the already existing planet and does not insert in data access', async () => {
    const planet = await createPlanet({
      id: Id.makeId(),
      mapServiceId: 'mapId',
      x: 0,
      y: 0,
      movementDifficulty: 1,
      resource: mockPlanetResource,
      neighborPlanets: {
        NORTH: 'mapId1',
        EAST: 'mapId2',
        SOUTH: 'mapId3',
        WEST: 'mapId4',
      },
    })

    expect(planetDb.findById.mock.calls.length).toBe(1)
    expect(planetDb.insert.mock.calls.length).toBe(0)
    expect(planet).toEqual(mockPlanet)
  })
})
