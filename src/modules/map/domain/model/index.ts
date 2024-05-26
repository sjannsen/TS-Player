import Id from '../Id'
import buildMakePlanet from './planet'

const makePlanet = buildMakePlanet({ Id: Id })

export default makePlanet
export { makePlanet, Id }
