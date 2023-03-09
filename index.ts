import { ethers } from 'ethers'
import EthersAdapter from '@safe-global/safe-ethers-lib'
// Initialize Safe Service Client
import SafeServiceClient from '@safe-global/safe-service-client'
// Initialize Safe Core SDK
import { SafeFactory } from '@safe-global/safe-core-sdk'
// Deploy a safe
import { SafeAccountConfig } from '@safe-global/safe-core-sdk'


async function main() {


const RPC_URL='https://rpc.ankr.com/eth_goerli'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

// Initialize signers
const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)
const owner2Signer = new ethers.Wallet(process.env.OWNER_2_PRIVATE_KEY!, provider)
const owner3Signer = new ethers.Wallet(process.env.OWNER_3_PRIVATE_KEY!, provider)

const ethAdapterOwner1 = new EthersAdapter({
  ethers,
  signerOrProvider: owner1Signer
})

// Initialize Safe Service Client
const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter: ethAdapterOwner1 })

// Initialize Safe Core SDK
const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })

// Deploy a safe
const safeAccountConfig: SafeAccountConfig = {
    owners: [
      await owner1Signer.getAddress(),
      await owner2Signer.getAddress(),
      await owner3Signer.getAddress()
    ],
    threshold: 2,
    // ... (Optional params)
  }
  
  /* This Safe is tied to owner 1 because the factory was initialized with
  an adapter that had owner 1 as the signer. */
  const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig })
  
  const safeAddress = safeSdkOwner1.getAddress()
  
  console.log('Your Safe has been deployed:')
  console.log(`https://goerli.etherscan.io/address/${safeAddress}`)
  console.log(`https://app.safe.global/gor:${safeAddress}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
