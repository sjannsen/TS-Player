import makeGetPlanets from './get-planets'
import { MockPlanetDb, clearMockPlanetDb, mockPlanet, mockPlanetDb } from './mocks/mock'

describe('getPlanets', () => {
  let planetDb: MockPlanetDb
  let getPlanets: ReturnType<typeof makeGetPlanets>

  // beforeEach(() => {
  //   clearMockPlanetDb()
  //   planetDb = mockPlanetDb
  //   getPlanets = makeGetPlanets({ planetDb })
  // })

  it('calls the data access layer and returns the planet', async () => {
    const planets = await getPlanets()
    expect(planetDb.findAll.mock.calls.length).toBe(1)
    expect(planets).toEqual([mockPlanet])
  })
})
