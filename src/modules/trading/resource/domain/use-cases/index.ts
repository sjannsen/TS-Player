import resourceDb from '../../adapters/output/data-access'
import makeCreateResource from './create-resource'
import makeGetRessource from './get-resource'
import makeGetSellingPrice from './get-selling-price'
import makeUpdateSellingPrice from './update-selling-price'

const createRessource = makeCreateResource({ resourceDb: resourceDb })
const getResource = makeGetRessource({ ressourceDb: resourceDb })
const getSellingPrice = makeGetSellingPrice({ getRessource: getResource })
const updateSellingPrice = makeUpdateSellingPrice({ resourceDb: resourceDb, getRessource: getResource })

const resourceService = Object.freeze({
  createRessource,
  getRessource: getResource,
  getSellingPrice,
  updateSellingPrice,
})

export default resourceService
export { createRessource, getResource, getSellingPrice, updateSellingPrice }
