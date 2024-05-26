import { PlanetNotFoundError } from '../model/planet.erros'
import makeMineResource from './mine-resource'
import { MockPlanetDb, clearMockPlanet, clearMockPlanetDb, mockPlanet, mockPlanetDb } from './mocks/mock'

describe('mineResource', () => {
  let planetDb: MockPlanetDb
  let mineResource: ReturnType<typeof makeMineResource>

  beforeEach(() => {
    clearMockPlanet()
    clearMockPlanetDb()

    planetDb = mockPlanetDb
    mineResource = makeMineResource({ planetDb })
  })

  it('calls mine resource and calls the data access layer', () => {
    mineResource({ id: mockPlanet.getId(), amount: 10 })

    expect(planetDb.find.mock.calls.length).toBe(1)
    expect(planetDb.find.mock.calls[0][0]).toEqual({ id: mockPlanet.getId() })
    expect(mockPlanet.mineResource.mock.calls.length).toBe(1)
    expect(mockPlanet.mineResource.mock.calls[0][0]).toBe(10)
    expect(planetDb.update.mock.calls.length).toBe(1)
  })

  it('throws an error, if the planet does not exist', () => {
    expect(() => mineResource({ id: 'invalidId', amount: 10 })).toThrow(PlanetNotFoundError)
  })
})
