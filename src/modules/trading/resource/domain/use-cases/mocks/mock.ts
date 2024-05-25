import { Resource } from '../../model/resource'
import { ResourceNotFoundError } from '../../model/resource.erros'

const mockResource: Resource = {
  getName: jest.fn().mockReturnValue('COAL'),
  getSellingPrice: jest.fn().mockReturnValue(10),
  updateSellingPrice: jest.fn(),
}

type MockResourceDb = {
  insert: jest.Mock
  update: jest.Mock
  find: jest.Mock
}

const mockResourceDb: MockResourceDb = {
  insert: jest.fn().mockReturnValue(mockResource),
  update: jest.fn().mockReturnValue(mockResource),
  find: jest.fn().mockImplementation((name) => {
    if (name == 'COAL') return mockResource
    return undefined
  }),
}

const mockGetResource = jest.fn().mockImplementation(({ name }) => {
  if (name == 'COAL') return mockResource
  throw new ResourceNotFoundError()
})

export { mockGetResource, mockResource, mockResourceDb }
