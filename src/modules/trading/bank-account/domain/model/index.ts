import { getCurrentRoundNumber } from '../../../../game/roundStatus'
import makeMoney from '../../../../shared/money/money'
import buildMakeBankAccount from './bankAccount'

const makeBankAccount = buildMakeBankAccount({ makeMoney: makeMoney, getRoundDuration: getCurrentRoundNumber })

export default makeBankAccount
