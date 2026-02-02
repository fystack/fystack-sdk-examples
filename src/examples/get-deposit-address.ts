import { FystackSDK, AddressType } from "@fystack/sdk";
import { credentials, environment, workspaceId, walletId } from "../config";

async function getDepositAddress(targetWalletId?: string) {
  console.log("=== Get Deposit Address Example ===\n");

  const sdk = new FystackSDK({
    credentials,
    environment,
    workspaceId,
    logger: true,
  });

  const wId = targetWalletId || walletId;
  if (!wId) {
    throw new Error(
      "Wallet ID is required. Set WALLET_ID in .env or pass as argument."
    );
  }

  try {
    // Get EVM (Ethereum) deposit address
    console.log("Fetching EVM deposit address...");
    const evmAddress = await sdk.getDepositAddress(wId, AddressType.Evm);
    console.log("\nEVM Deposit Address:");
    console.log("  Address:", evmAddress.address);
    console.log(
      "  QR Code:",
      evmAddress.qr_code ? "Available" : "Not available"
    );

    // Get Solana deposit address
    console.log("\nFetching Solana deposit address...");
    const solAddress = await sdk.getDepositAddress(wId, AddressType.Solana);
    console.log("\nSolana Deposit Address:");
    console.log("  Address:", solAddress.address);
    console.log(
      "  QR Code:",
      solAddress.qr_code ? "Available" : "Not available"
    );

    return { evm: evmAddress, solana: solAddress };
  } catch (error) {
    console.error("Failed to get deposit address:", error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  getDepositAddress(process.argv[2])
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { getDepositAddress };
