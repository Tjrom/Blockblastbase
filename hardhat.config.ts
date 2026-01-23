import type { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-ethers'
import * as dotenv from 'dotenv'

dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY || ''
const BASE_SEPOLIA_RPC = process.env.BASE_SEPOLIA_RPC || 'https://sepolia.base.org'

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  networks: {
    baseSepolia: {
      url: BASE_SEPOLIA_RPC,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 84532,
    },
  },
}

export default config

