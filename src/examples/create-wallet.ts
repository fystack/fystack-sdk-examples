import { FystackSDK, WalletType, WalletPurpose } from "@fystack/sdk";
import { credentials, environment, workspaceId } from "../config";
import * as readline from "readline";

function askWalletType(): Promise<WalletType> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    console.log("Select wallet type:");
    console.log("1. MPC");
    console.log("2. Hyper");
    rl.question("Enter 1 or 2: ", (answer) => {
      rl.close();
      if (answer === "2") {
        resolve(WalletType.Hyper);
      } else {
        resolve(WalletType.MPC);
      }
    });
  });
}

async function createWallet() {
  console.log("=== Create Wallet Example ===\n");

  const walletType = await askWalletType();

  const sdk = new FystackSDK({
    credentials,
    environment,
    workspaceId,
    logger: true,
  });

  try {
    const response = await sdk.createWallet(
      {
        name: `Test Wallet ${Date.now()}`,
        walletType,
        walletPurpose: WalletPurpose.General,
      },
      true // Wait for completion
    );

    console.log("\nWallet created successfully!");
    console.log("Wallet ID:", response.wallet_id);

    if (walletType !== WalletType.Hyper) {
      const statusResponse = await sdk.getWalletCreationStatus(
        response.wallet_id
      );
      console.log("Status:", statusResponse.status);
      return statusResponse;
    }

    return response;
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
