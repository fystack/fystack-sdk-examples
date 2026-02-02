import { FystackSDK, WalletType, WalletPurpose } from "@fystack/sdk";
import { credentials, environment, workspaceId } from "../config";

async function createWallet() {
  console.log("=== Create Wallet Example ===\n");

  const sdk = new FystackSDK({
    credentials,
    environment,
    workspaceId,
    logger: true,
  });

  try {
    // Create a new standard wallet
    const response = await sdk.createWallet(
      {
        name: `Test Wallet ${Date.now()}`,
        walletType: WalletType.MPC,
        walletPurpose: WalletPurpose.General,
      },
      true // Wait for completion
    );

    console.log("\nWallet created successfully!");
    console.log("Wallet ID:", response.wallet_id);

    // Workaround: SDK bug - initial response doesn't include status,
    // so waitForCompletion doesn't trigger. Manually get status.
    const statusResponse = await sdk.getWalletCreationStatus(
      response.wallet_id
    );
    console.log("Status:", statusResponse.status);

    return statusResponse;
  } catch (error) {
    console.error("Failed to create wallet:", error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  createWallet()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { createWallet };
