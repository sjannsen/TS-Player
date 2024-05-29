import makeMoney from '../../../../shared/money/money'
import bankAccountDb from '../../output/data-access'
import makeCreateBankAccount from './create-bank-account'
import makeDepositMoney from './deposit-money'
import makeGetBalance from './get-balance'
import makeGetBankAccount from './get-bank-account'
import makeGetTransactionHistory from './get-transaction-history'
import makeWithdrawMoney from './withdraw-money'

const createBankAccount = makeCreateBankAccount({ makeMoney, bankAccountDb })

const getBankAccount = makeGetBankAccount({ createBankAccount, bankAccountDb })

const depositMoney = makeDepositMoney({ getBankAccount, bankAccountDb })

const withdrawMoney = makeWithdrawMoney({ getBankAccount, bankAccountDb })

const getBalance = makeGetBalance({ getBankAccount })

const getTransactionHistory = makeGetTransactionHistory({ getBankAccount })

const bankAccountService = Object.freeze({
  createBankAccount,
  depositMoney,
  withdrawMoney,
  getBalance,
  getTransactionHistory,
})

export default bankAccountService
export { createBankAccount, depositMoney, getBalance, getTransactionHistory, withdrawMoney }
