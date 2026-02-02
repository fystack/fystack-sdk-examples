import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import { SolanaSigner } from '@fystack/sdk'
import { credentials, environment, walletId, solanaRpcUrl, solanaRecipientAddress } from '../config'

async function solanaTransfer(
  targetWalletId?: string,
  recipientAddress?: string,
  amountInSol?: number
) {
  console.log('=== Solana Transfer Example ===\n')

  const wId = targetWalletId || walletId
  const recipient = recipientAddress || solanaRecipientAddress

  if (!wId) {
    throw new Error('Wallet ID is required. Set WALLET_ID in .env or pass as argument.')
  }
  if (!recipient) {
    throw new Error('Recipient address is required. Set SOLANA_RECIPIENT_ADDRESS in .env or pass as argument.')
  }

  try {
    // Create signer
    const signer = new SolanaSigner(credentials, environment)
    signer.setWallet(wId)

    // Get wallet address (public key)
    const walletAddress = await signer.getAddress()
    console.log('Wallet Address (Public Key):', walletAddress)

    // Connect to Solana
    console.log('\nConnecting to Solana RPC:', solanaRpcUrl)
    const connection = new Connection(solanaRpcUrl, 'confirmed')

    // Check balance
    const fromPubkey = new PublicKey(walletAddress)
    const balance = await connection.getBalance(fromPubkey)
    console.log('Current Balance:', balance / LAMPORTS_PER_SOL, 'SOL')

    // Prepare transaction
    const toPubkey = new PublicKey(recipient)
    const lamports = Math.floor((amountInSol || 0.001) * LAMPORTS_PER_SOL)

    console.log('\nSending', lamports / LAMPORTS_PER_SOL, 'SOL to:', recipient)

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized')

    // Create transfer instruction
    const transferInstruction = SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    })

    // Build transaction
    const transaction = new Transaction().add(transferInstruction)
    transaction.recentBlockhash = blockhash
    transaction.feePayer = fromPubkey
    transaction.lastValidBlockHeight = lastValidBlockHeight

    // Serialize transaction to base64
    const serializedTx = transaction
      .serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      })
      .toString('base64')

    // Sign and send transaction
    console.log('\nSigning and sending transaction...')
    const signature = await signer.signAndSendTransaction(serializedTx)

    console.log('\nTransaction sent!')
    console.log('Signature:', signature)

    // Confirm transaction
    console.log('Waiting for confirmation...')
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    })

    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`)
    }

    console.log('\nTransaction confirmed!')
    return signature
  } catch (error) {
    console.error('Failed to send Solana transfer:', error)
    throw error
  }
}

// Run if executed directly
if (require.main === module) {
  solanaTransfer()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export { solanaTransfer }
