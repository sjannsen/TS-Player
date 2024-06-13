import { PlanetNotFoundError } from '../model/planet.erros'
import makeMineResource from './mine-resource'
import { MockPlanetDb, clearMockPlanetDb, mockPlanet, mockPlanetDb } from './mocks/mock'

describe('mineResource', () => {
  let planetDb: MockPlanetDb
  let mineResource: ReturnType<typeof makeMineResource>

  // beforeEach(() => {
  //   clearMockPlanetDb()

  //   planetDb = mockPlanetDb
  //   mineResource = makeMineResource({ planetDb })
  // })

  it('calls mine resource and calls the data access layer', async () => {
    const updated = await mineResource({ mapServiceId: 'mapId', amount: 10 })

    expect(planetDb.findById.mock.calls.length).toBe(1)
    expect(planetDb.findById.mock.calls[0][0]).toEqual({ mapServiceId: 'mapId' })
    expect(planetDb.updateResourceAmount.mock.calls.length).toBe(1)
    expect(updated.resource?.currentAmount).toBe(90)
  })

  it('throws an error, if the planet does not exist', async () => {
    expect(mineResource({ mapServiceId: 'invalidId', amount: 10 })).rejects.toThrow(PlanetNotFoundError)
  })
})
