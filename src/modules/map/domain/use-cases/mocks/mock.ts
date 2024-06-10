import { ResourceType } from '../../../../../shared/types'
import Id from '../../Id'
import { PlanetData, PlanetResource } from '../../model/planet'

const mockPlanetResource: PlanetResource = {
  resourceType: 'COAL',
  currentAmount: 100,
  maxAmount: 100,
}

const mockPlanetId = Id.makeId()

const mockPlanet: PlanetData = {
  id: mockPlanetId,
  mapServiceId: 'mapId',
  movementDifficulty: 1,
  x: 0,
  y: 0,
  neighborPlanets: { NORTH: undefined, EAST: undefined, SOUTH: undefined, WEST: undefined },
  resource: mockPlanetResource,
}

export type MockPlanetDb = {
  findById: jest.Mock
  findAll: jest.Mock
  insert: jest.Mock
  update: jest.Mock
  addResource: jest.Mock
  addCoordinates: jest.Mock
  updateResourceAmount: jest.Mock
  updateNeighbors: jest.Mock
}

const mockPlanetDb: MockPlanetDb = {
  findById: jest
    .fn()
    .mockImplementation((queryParams: { id?: string; mapServiceId?: string; resource?: ResourceType }) => {
      if (queryParams.resource === 'COAL' || queryParams.mapServiceId === 'mapId' || queryParams.id === mockPlanetId)
        return Promise.resolve(mockPlanet)
      return Promise.resolve(undefined)
    }),
  update: jest.fn().mockReturnValue(mockPlanet),
  findAll: jest.fn().mockReturnValue([mockPlanet]),
  insert: jest.fn().mockReturnValue(mockPlanet),
  addResource: jest.fn(),
  addCoordinates: jest.fn(),
  updateResourceAmount: jest.fn(),
  updateNeighbors: jest.fn(),
}

const clearMockPlanetDb = () => {
  mockPlanetDb.findById.mockClear()
  mockPlanetDb.update.mockClear()
  mockPlanetDb.findAll.mockClear()
  mockPlanetDb.insert.mockClear()
}

export { clearMockPlanetDb, mockPlanet, mockPlanetDb, mockPlanetResource }
