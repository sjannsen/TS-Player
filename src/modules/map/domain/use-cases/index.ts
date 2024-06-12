import planetDb from '../../adapters/output/data-access'
import makeCreatePlanet from './create-planet'
import makeGetPlanet from './get-planet'
import makeGetPlanetResource from './get-planet-resource'
import makeGetPlanets from './get-planets'
import makeMineResource from './mine-resource'
import makeMakeUpdatePlanet from './update-planet'

const createPlanet = makeCreatePlanet({ planetDb })
const getPlanet = makeGetPlanet({ planetDb })
const getPlanetResource = makeGetPlanetResource({ planetDb })
const getPlanets = makeGetPlanets({ planetDb })
const mineResource = makeMineResource({ planetDb })
const updatePlanet = makeMakeUpdatePlanet({ planetDb })

const planetService = Object.freeze({
  createPlanet,
  getPlanet,
  getPlanetResource,
  getPlanets,
  mineResource,
  updatePlanet,
})

export default planetService
export { createPlanet, getPlanet, getPlanetResource, getPlanets, mineResource }
