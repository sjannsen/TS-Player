import Id from '../../Id'
import { PlanetResource } from '../../model/planet'

const mockPlanetResource: PlanetResource = {
  type: 'COAL',
  currentAmount: 100,
  maxAmount: 100,
}

type MockPlanet = {
  getId: jest.Mock
  getMapServiceId: jest.Mock
  getX: jest.Mock
  getY: jest.Mock
  getMovementDifficulty: jest.Mock
  getResource: jest.Mock
  getNeighborPlanets: jest.Mock
  mineResource: jest.Mock
}

const mockPlanet: MockPlanet = {
  getId: jest.fn().mockReturnValue(Id.makeId()),
  getMapServiceId: jest.fn().mockReturnValue('mapId'),
  getMovementDifficulty: jest.fn().mockReturnValue(1),
  getX: jest.fn().mockReturnValue(0),
  getY: jest.fn().mockReturnValue(0),
  getNeighborPlanets: jest
    .fn()
    .mockReturnValue({ NORTH: undefined, EAST: undefined, SOUTH: undefined, WEST: undefined }),
  getResource: jest.fn().mockReturnValue(mockPlanetResource),
  mineResource: jest.fn(),
}

const clearMockPlanet = () => {
  mockPlanet.getId.mockClear()
  mockPlanet.getMapServiceId.mockClear()
  mockPlanet.getMovementDifficulty.mockClear()
  mockPlanet.getX.mockClear()
  mockPlanet.getY.mockClear()
  mockPlanet.getNeighborPlanets.mockClear()
  mockPlanet.getResource.mockClear()
  mockPlanet.mineResource.mockClear()
}

export type MockPlanetDb = {
  find: jest.Mock
  findAll: jest.Mock
  insert: jest.Mock
  update: jest.Mock
}

const mockPlanetDb: MockPlanetDb = {
  find: jest.fn().mockImplementation((queryParams: { id?: string; mapServiceId?: string; resource?: ResourceType }) => {
    if (
      queryParams.resource === 'COAL' ||
      queryParams.mapServiceId === 'mapId' ||
      queryParams.id === mockPlanet.getId()
    )
      return mockPlanet
    return undefined
  }),
  update: jest.fn().mockReturnValue(mockPlanet),
  findAll: jest.fn().mockReturnValue([mockPlanet]),
  insert: jest.fn().mockReturnValue(mockPlanet),
}

const clearMockPlanetDb = () => {
  mockPlanetDb.find.mockClear()
  mockPlanetDb.update.mockClear()
  mockPlanetDb.findAll.mockClear()
  mockPlanetDb.insert.mockClear()
}

export { clearMockPlanet, clearMockPlanetDb, mockPlanet, mockPlanetDb, mockPlanetResource }
