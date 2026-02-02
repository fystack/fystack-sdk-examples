import { createWallet } from './examples/create-wallet'
import { getDepositAddress } from './examples/get-deposit-address'
import { createWithdrawal } from './examples/create-withdrawal'
import { ethTransfer } from './examples/eth-transfer'
import { solanaTransfer } from './examples/solana-transfer'
import { getPublicKey } from './examples/get-public-key'

async function runExample(name: string, fn: () => Promise<unknown>) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`Running: ${name}`)
  console.log('='.repeat(60))

  try {
    await fn()
    console.log(`\n${name} completed successfully!`)
  } catch (error) {
    console.error(`\n${name} failed:`, error)
  }
}

async function main() {
  const args = process.argv.slice(2)
  const exampleName = args[0]

  const examples: Record<string, () => Promise<unknown>> = {
    'create-wallet': createWallet,
    'get-deposit-address': getDepositAddress,
    'create-withdrawal': createWithdrawal,
    'eth-transfer': ethTransfer,
    'solana-transfer': solanaTransfer,
    'get-public-key': getPublicKey,
  }

  if (exampleName) {
    if (examples[exampleName]) {
      await runExample(exampleName, examples[exampleName])
    } else {
      console.log('Unknown example:', exampleName)
      console.log('Available examples:', Object.keys(examples).join(', '))
      process.exit(1)
    }
  } else {
    console.log('Fystack SDK Examples')
    console.log('====================\n')
    console.log('Available examples:')
    Object.keys(examples).forEach((name) => {
      console.log(`  - ${name}`)
    })
    console.log('\nUsage:')
    console.log('  npm start <example-name>')
    console.log('  npm run <example-name>')
    console.log('\nExample:')
    console.log('  npm start create-wallet')
    console.log('  npm run get-public-key')
  }
}

main().catch(console.error)

export {
  createWallet,
  getDepositAddress,
  createWithdrawal,
  ethTransfer,
  solanaTransfer,
  getPublicKey,
}
