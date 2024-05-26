import makeGetPlanets from './get-planets'
import { MockPlanetDb, clearMockPlanet, clearMockPlanetDb, mockPlanet, mockPlanetDb } from './mocks/mock'

describe('getPlanets', () => {
  let planetDb: MockPlanetDb
  let getPlanets: ReturnType<typeof makeGetPlanets>

  beforeEach(() => {
    clearMockPlanet()
    clearMockPlanetDb()

    planetDb = mockPlanetDb
    getPlanets = makeGetPlanets({ planetDb })
  })
  it('calls the data access layer and returns the planet', () => {
    const planets = getPlanets()

    expect(planetDb.findAll.mock.calls.length).toBe(1)
    expect(planets).toEqual([mockPlanet])
  })
})
