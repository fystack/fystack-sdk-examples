import { JsonRpcProvider, parseEther } from 'ethers'
import { EtherSigner, Environment } from '@fystack/sdk'
import { credentials, environment, walletId, ethereumRpcUrl, ethRecipientAddress } from '../config'

async function ethTransfer(
  targetWalletId?: string,
  recipientAddress?: string,
  amountInEth?: string
) {
  console.log('=== Ethereum Transfer Example ===\n')

  const wId = targetWalletId || walletId
  const recipient = recipientAddress || ethRecipientAddress

  if (!wId) {
    throw new Error('Wallet ID is required. Set WALLET_ID in .env or pass as argument.')
  }
  if (!recipient) {
    throw new Error('Recipient address is required. Set ETH_RECIPIENT_ADDRESS in .env or pass as argument.')
  }

  try {
    // Create signer
    const signer = new EtherSigner(credentials, environment)
    signer.setWallet(wId)

    // Get wallet address (public key)
    const walletAddress = await signer.getAddress()
    console.log('Wallet Address:', walletAddress)

    // Connect to provider
    console.log('\nConnecting to Ethereum RPC:', ethereumRpcUrl)
    const provider = new JsonRpcProvider(ethereumRpcUrl)
    const signerWithProvider = signer.connect(provider)

    // Check balance
    const balance = await provider.getBalance(walletAddress)
    console.log('Current Balance:', balance.toString(), 'wei')

    // Prepare and send transaction
    const amount = amountInEth || '0.0001'
    console.log('\nSending', amount, 'ETH to:', recipient)

    const tx = await signerWithProvider.sendTransaction({
      to: recipient,
      value: parseEther(amount),
    })

    console.log('\nTransaction sent!')
    console.log('Transaction Hash:', tx.hash)
    console.log('Waiting for confirmation...')

    const receipt = await tx.wait()
    console.log('\nTransaction confirmed!')
    console.log('Block Number:', receipt?.blockNumber)
    console.log('Gas Used:', receipt?.gasUsed.toString())

    return tx
  } catch (error) {
    console.error('Failed to send ETH transfer:', error)
    throw error
  }
}

// Run if executed directly
if (require.main === module) {
  ethTransfer()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export { ethTransfer }
