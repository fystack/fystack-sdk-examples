# Fystack SDK Examples

Example project demonstrating Fystack Wallet SDK usage for wallet management, deposits, withdrawals, and blockchain transfers.

## Prerequisites

- Node.js 18+
- Fystack API credentials (API Key and Secret)
- A Fystack workspace

## Installation

```bash
npm install
```

## Configuration

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update `.env` with your credentials:

```env
FYSTACK_API_KEY=your_api_key_here
FYSTACK_API_SECRET=your_api_secret_here
FYSTACK_WORKSPACE_ID=your_workspace_id_here
FYSTACK_ENVIRONMENT=production
```

## Available Examples

| Command                       | Description                        |
| ----------------------------- | ---------------------------------- |
| `npm run create-wallet`       | Create a new MPC wallet            |
| `npm run get-deposit-address` | Get deposit addresses for a wallet |
| `npm run create-withdrawal`   | Request a withdrawal from a wallet |
| `npm run eth-transfer`        | Execute an Ethereum transfer       |
| `npm run solana-transfer`     | Execute a Solana transfer          |
| `npm run get-public-key`      | Get the public key for a wallet    |

---

## Create Wallet

Create a new wallet in your Fystack workspace.

### Run

```bash
npm run create-wallet
```

### Sample Response

```
=== Create Wallet Example ===

[FystackSDK] Polling wallet creation status...
[FystackSDK] Polling wallet creation status...
[FystackSDK] Polling wallet creation status...
[FystackSDK] Polling wallet creation status...
[FystackSDK] Polling wallet creation status...
[FystackSDK] Wallet creation completed with status: success

Wallet created successfully!
Wallet ID: f4d44a3e-233b-4aff-8b91-8144b1f5820d
Status: success
```

### Wallet Types

The example creates an **MPC wallet** by default. You can change the wallet type in `src/examples/create-wallet.ts`:

```typescript
// MPC Wallet (default) - Multi-Party Computation
walletType: WalletType.MPC;

// Hyper Wallet - Alternative wallet type
walletType: WalletType.Hyper;
```

| Wallet Type        | Description                                                    |
| ------------------ | -------------------------------------------------------------- |
| `WalletType.MPC`   | Multi-Party Computation wallet with distributed key management |
| `WalletType.Hyper` | Hyper wallet for different use cases                           |

### Notes

- Save the `Wallet ID` from the response - you'll need it for other operations like deposits and withdrawals
- Add the wallet ID to your `.env` file: `WALLET_ID=your_wallet_id_here`

---

## Create Withdrawal

Request a withdrawal from your Fystack wallet to an external address.

### Setup

1. **Set `WALLET_ID` in your `.env` file**

   You need an existing wallet ID. You can get this by running `npm run create-wallet` first, or from your Fystack dashboard.

   ```env
   WALLET_ID=your_wallet_id_here
   ```

2. **Get the `ASSET_ID` from the API**

   The asset ID identifies which cryptocurrency you want to withdraw. Fetch it from the Fystack API:

   ```bash
   curl "https://api.fystack.io/api/v1/assets?symbol=ETH"
   ```

   This returns the asset details including the `id`. Add it to your `.env`:

   ```env
   ASSET_ID=your_asset_id_here
   ```

3. **Set the recipient address**

   ```env
   ETH_RECIPIENT_ADDRESS=0xYourRecipientAddressHere
   ```

### Run

```bash
npm run create-withdrawal
```

### Sample Response

```
=== Create Withdrawal Example ===

Requesting withdrawal...
  Wallet ID: e0341fe8-ddd4-4d40-ad05-31516f8e8ca0
  Asset ID: a469642e-5466-4d69-834d-537f33ee5c81
  Recipient: 0x0000000000000000000000000000000000000000
  Amount: 0.0001
[FystackSDK] Requesting withdrawal from wallet e0341fe8-ddd4-4d40-ad05-31516f8e8ca0
[FystackSDK] Withdrawal request completed, auto_approved: false

Withdrawal request submitted!
Auto Approved: false
Withdrawal ID: 9ed13061-9f9c-4bd3-a61a-bc85e97f0d9e
Status: PENDING_APPROVAL
```

### Response Fields

| Field           | Description                                                                          |
| --------------- | ------------------------------------------------------------------------------------ |
| `Auto Approved` | Whether the withdrawal was automatically approved based on your workspace policies   |
| `Withdrawal ID` | Unique identifier for tracking the withdrawal                                        |
| `Status`        | Current status (`PENDING_APPROVAL`, `APPROVED`, `PROCESSING`, `COMPLETED`, `FAILED`) |

### Notes

- Withdrawals may require manual approval depending on your workspace configuration
- The default amount is `0.0001` - modify the code to change this
- Ensure your wallet has sufficient balance for the withdrawal amount plus network fees

---

## Environment Variables Reference

| Variable                   | Required        | Description                                           |
| -------------------------- | --------------- | ----------------------------------------------------- |
| `FYSTACK_API_KEY`          | Yes             | Your Fystack API key                                  |
| `FYSTACK_API_SECRET`       | Yes             | Your Fystack API secret                               |
| `FYSTACK_WORKSPACE_ID`     | Yes             | Your workspace ID                                     |
| `FYSTACK_ENVIRONMENT`      | No              | `sandbox` (default), `production`, or `local`         |
| `WALLET_ID`                | For some ops    | Wallet ID for operations requiring an existing wallet |
| `ASSET_ID`                 | For withdrawals | Asset ID (get from `/api/v1/assets?symbol=ETH`)       |
| `ETH_RECIPIENT_ADDRESS`    | For ETH ops     | Ethereum recipient address                            |
| `SOLANA_RECIPIENT_ADDRESS` | For SOL ops     | Solana recipient address                              |
| `ETHEREUM_RPC_URL`         | No              | Custom Ethereum RPC (default: Sepolia testnet)        |
| `SOLANA_RPC_URL`           | No              | Custom Solana RPC (default: Devnet)                   |

### Available Environments

The `FYSTACK_ENVIRONMENT` variable maps to SDK environment constants:

| `.env` Value | SDK Constant             | Description                           |
| ------------ | ------------------------ | ------------------------------------- |
| `sandbox`    | `Environment.Sandbox`    | Sandbox/testing environment (default) |
| `production` | `Environment.Production` | Production environment                |
| `local`      | `Environment.Local`      | Local development environment         |
