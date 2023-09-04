import { ethers } from 'ethers'
import { makeAutoObservable } from 'mobx'
import { abi } from '../utils/constants'

const mockTransactions = [
  {
    type: 'sell',
    amountToken: 300,
    tokenName: 'ТТР',
    amountFiat: 300000,
    from: 'Главный счет',
  },
  {
    type: 'buy',
    amountToken: 400,
    tokenName: 'ТТР',
    amountFiat: 400000,
    from: 'Главный счет',
  },
  {
    type: 'buy',
    amountToken: 500,
    tokenName: 'ТТР',
    amountFiat: 500000,
    from: 'Главный счет',
  },
  {
    type: 'sell',
    amountToken: 500,
    tokenName: 'ТТР',
    amountFiat: 500000,
    from: 'Главный счет',
  },
]

const provider = new ethers.JsonRpcProvider(
  'https://eth-sepolia.g.alchemy.com/v2/rHtEMynbF8ZihFUJVC09QzKtftiX_s89',
)
const countryTokenFactoryContractAddress =
  '0x18247a2b97bece98e682e49631535b06477ea4da'
const contract = new ethers.Contract(
  countryTokenFactoryContractAddress,
  abi,
  provider,
)

export class UserStore {
  goldPrice = 1900
  currentBalance = 19_500_000
  tokenBalances: { [key: string]: number } = {
    ТТР: 100,
    ТТК: 0,
    ТТИ: 0,
  }
  operationStatus = 'waiting'
  transactionHistory = mockTransactions

  constructor() {
    makeAutoObservable(this)
  }

  // Фетч стоимости золота из смарт-контракта оракула в USD
  fetchGoldPrice = async () => {
    try {
      const goldPrice = await contract.getCurrentGoldPrice()
      this.goldPrice = parseInt(goldPrice.toString()) / 100000000
      console.log(`Current Gold Price: ${this.goldPrice}`)
    } catch (error) {
      console.error('Error fetching gold price:', error)
    }
  }

  addToken = (key: string, amount: number) => {
    this.tokenBalances[key] = amount
  }

  buyToken = async (key: string, amount: number) => {
    setTimeout(() => {
      this.tokenBalances[key] = this.tokenBalances[key] + Number(amount)
      this.currentBalance =
        this.currentBalance - Number(amount) * this.goldPrice * 95
      this.operationStatus = 'success'
      this.transactionHistory = [
        {
          type: 'buy',
          amountToken: Number(amount),
          tokenName: key,
          amountFiat: Number(amount) * this.goldPrice * 95,
          from: 'Главный счет',
        },
        ...this.transactionHistory,
      ]

      setTimeout(() => {
        this.operationStatus = 'waiting'
      }, 6000)
    }, 2000)
  }

  sellToken = async (key: string, amount: number) => {
    setTimeout(() => {
      this.tokenBalances[key] = this.tokenBalances[key] - Number(amount)
      this.currentBalance =
        this.currentBalance + Number(amount) * this.goldPrice * 95
      this.operationStatus = 'success'
      this.transactionHistory = [
        {
          type: 'sell',
          amountToken: Number(amount),
          tokenName: key,
          amountFiat: Number(amount) * this.goldPrice * 95,
          from: 'Главный счет',
        },
        ...this.transactionHistory,
      ]

      setTimeout(() => {
        this.operationStatus = 'waiting'
      }, 6000)
    }, 2000)
  }
}
