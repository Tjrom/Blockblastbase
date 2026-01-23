import { ethers } from 'hardhat'

async function main() {
  const Leaderboard = await ethers.getContractFactory('BlockBlastLeaderboard')
  const leaderboard = await Leaderboard.deploy()
  await leaderboard.waitForDeployment()

  const address = await leaderboard.getAddress()
  console.log('BlockBlastLeaderboard deployed to:', address)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

