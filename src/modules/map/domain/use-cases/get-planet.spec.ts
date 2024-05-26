import { PlanetInvalidArgumentError } from '../model/planet.erros'
import makeGetPlanet from './get-planet'
import { MockPlanetDb, clearMockPlanet, clearMockPlanetDb, mockPlanet, mockPlanetDb } from './mocks/mock'

describe('getPlanet', () => {
  let planetDb: MockPlanetDb
  let getPlanet: ReturnType<typeof makeGetPlanet>

  beforeEach(() => {
    clearMockPlanet()
    clearMockPlanetDb()

    planetDb = mockPlanetDb
    getPlanet = makeGetPlanet({ planetDb })
  })

  it('calls the data access to get planet', () => {
    const planet = getPlanet({ id: mockPlanet.getId() })

    expect(planetDb.find.mock.calls.length).toBe(1)
    expect(planetDb.find.mock.calls[0][0]).toEqual({ id: mockPlanet.getId() })
    expect(planet).toStrictEqual(mockPlanet)
  })

  it('throws an error, if the query params are undefined', () => {
    expect(() => getPlanet({})).toThrow(PlanetInvalidArgumentError)
  })
})
