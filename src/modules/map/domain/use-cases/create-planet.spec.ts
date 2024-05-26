import Id from '../Id'
import makeCreatePlanet from './create-planet'
import {
  MockPlanetDb,
  clearMockPlanet,
  clearMockPlanetDb,
  mockPlanet,
  mockPlanetDb,
  mockPlanetResource,
} from './mocks/mock'

describe('createPlanet', () => {
  let planetDb: MockPlanetDb
  let createPlanet: ReturnType<typeof makeCreatePlanet>

  beforeEach(() => {
    clearMockPlanet()
    clearMockPlanetDb()

    planetDb = mockPlanetDb
    createPlanet = makeCreatePlanet({ planetDb })
  })

  it('creates a planet and calls data access layer', () => {
    createPlanet({
      id: Id.makeId(),
      mapServiceId: 'newMapId',
      x: 0,
      y: 0,
      movementDifficulty: 1,
      resource: mockPlanetResource,
    })

    expect(planetDb.find.mock.calls.length).toBe(1)
    expect(planetDb.insert.mock.calls.length).toBe(1)
  })

  it('returns the already existing planet and does not insert in data access', () => {
    const planet = createPlanet({
      id: Id.makeId(),
      mapServiceId: 'mapId',
      x: 0,
      y: 0,
      movementDifficulty: 1,
      resource: mockPlanetResource,
    })

    expect(planetDb.find.mock.calls.length).toBe(1)
    expect(planetDb.insert.mock.calls.length).toBe(0)
    expect(planet).toEqual(mockPlanet)
  })
})
