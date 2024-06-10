import { getCurrentRoundNumber } from '../../../../game/roundStatus'
import buildMakeBankAccount from './bankAccount'

const makeBankAccount = buildMakeBankAccount({ getRoundDuration: getCurrentRoundNumber })

export default makeBankAccount
