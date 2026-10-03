import { JsonRpcProvider, TypedDataEncoder, verifyTypedData } from 'ethers'
import { EtherSigner } from '@fystack/sdk'
import { credentials, environment, walletId, ethereumRpcUrl } from '../config'

// Nested types demonstrate EIP-712 signing with a sample message.
const types = {
  Person: [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'address' },
  ],
  Mail: [
    { name: 'from', type: 'Person' },
    { name: 'to', type: 'Person' },
    { name: 'contents', type: 'string' },
  ],
}

async function signTypedData(targetWalletId?: string) {
  console.log('=== Sign Typed Data Example ===\n')

  const wId = targetWalletId || walletId

  if (!wId) {
    throw new Error('Wallet ID is required. Set WALLET_ID in .env or pass as argument.')
  }

  const provider = new JsonRpcProvider(ethereumRpcUrl)

  try {
    const signer = new EtherSigner(credentials, environment, provider)
    signer.setWallet(wId)

    const address = await signer.getAddress()
    const { chainId } = await provider.getNetwork()
    const domain = {
      name: 'Fystack EIP712 Example',
      version: '1',
      chainId: chainId.toString(),
      verifyingContract: '0x0000000000000000000000000000000000000000',
    }
    const message = {
      from: { name: 'Fystack', wallet: address },
      to: { name: 'Example Recipient', wallet: address },
      contents: 'Hello from Fystack!',
    }

    console.log('Wallet Address:', address)
    console.log('Primary Type:', TypedDataEncoder.from(types).primaryType)
    console.log('Digest:', TypedDataEncoder.hash(domain, types, message))

    const signature = await signer.signTypedData(domain, types, message)
    const recoveredAddress = verifyTypedData(domain, types, message, signature)

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      throw new Error(`Signature mismatch: expected ${address}, recovered ${recoveredAddress}`)
    }

    console.log('\nTyped data signed successfully!')
    console.log('Signature:', signature)
    console.log('Recovered Address:', recoveredAddress)

    return signature
  } catch (error) {
    console.error('Failed to sign typed data:', error)
    throw error
  } finally {
    provider.destroy()
  }
}

// Run if executed directly
if (require.main === module) {
  signTypedData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export { signTypedData }
