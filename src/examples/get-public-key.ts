import { EtherSigner, SolanaSigner } from '@fystack/sdk'
import { credentials, environment, walletId } from '../config'

async function getPublicKey(targetWalletId?: string) {
  console.log('=== Get Public Key Example ===\n')

  const wId = targetWalletId || walletId

  if (!wId) {
    throw new Error('Wallet ID is required. Set WALLET_ID in .env or pass as argument.')
  }

  try {
    // Get Ethereum public key (address)
    console.log('Fetching Ethereum address...')
    const etherSigner = new EtherSigner(credentials, environment)
    etherSigner.setWallet(wId)
    const ethAddress = await etherSigner.getAddress()
    console.log('Ethereum Address:', ethAddress)

    // Get Solana public key
    console.log('\nFetching Solana public key...')
    const solanaSigner = new SolanaSigner(credentials, environment)
    solanaSigner.setWallet(wId)
    const solAddress = await solanaSigner.getAddress()
    console.log('Solana Public Key:', solAddress)

    return {
      ethereum: ethAddress,
      solana: solAddress,
    }
  } catch (error) {
    console.error('Failed to get public keys:', error)
    throw error
  }
}

// Run if executed directly
if (require.main === module) {
  getPublicKey()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export { getPublicKey }
