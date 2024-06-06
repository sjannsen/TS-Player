import { PlanetInvalidArgumentError } from '../model/planet.erros'
import makeGetPlanet from './get-planet'
import { MockPlanetDb, clearMockPlanetDb, mockPlanet, mockPlanetDb } from './mocks/mock'

describe('getPlanet', () => {
  let planetDb: MockPlanetDb
  let getPlanet: ReturnType<typeof makeGetPlanet>

  beforeEach(() => {
    clearMockPlanetDb()

    planetDb = mockPlanetDb
    getPlanet = makeGetPlanet({ planetDb })
  })

  it('calls the data access to get planet', async () => {
    const planet = await getPlanet({ id: mockPlanet.id })

    expect(planetDb.findById.mock.calls.length).toBe(1)
    expect(planetDb.findById.mock.calls[0][0]).toEqual({ id: mockPlanet.id })
    expect(planet).toStrictEqual(mockPlanet)
  })

  it('throws an error, if the query params are undefined', async () => {
    expect(getPlanet({})).rejects.toThrow(PlanetInvalidArgumentError)
  })
})
