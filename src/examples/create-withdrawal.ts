import { FystackSDK } from "@fystack/sdk";
import {
  credentials,
  environment,
  workspaceId,
  walletId,
  assetId,
  ethRecipientAddress,
} from "../config";

async function createWithdrawal(
  targetWalletId?: string,
  targetAssetId?: string,
  recipientAddress?: string,
  amount?: string
) {
  console.log("=== Create Withdrawal Example ===\n");

  const sdk = new FystackSDK({
    credentials,
    environment,
    workspaceId,
    logger: true,
  });

  const wId = targetWalletId || walletId;
  const aId = targetAssetId || assetId;
  const recipient = recipientAddress || ethRecipientAddress;

  if (!wId) {
    throw new Error(
      "Wallet ID is required. Set WALLET_ID in .env or pass as argument."
    );
  }
  if (!aId) {
    throw new Error(
      "Asset ID is required. Set ASSET_ID in .env or pass as argument."
    );
  }
  if (!recipient) {
    throw new Error(
      "Recipient address is required. Set ETH_RECIPIENT_ADDRESS in .env or pass as argument."
    );
  }

  try {
    console.log("Requesting withdrawal...");
    console.log("  Wallet ID:", wId);
    console.log("  Asset ID:", aId);
    console.log("  Recipient:", recipient);
    console.log("  Amount:", amount || "0.0001");

    const response = await sdk.requestWithdrawal(wId, {
      assetId: aId,
      amount: amount || "0.0001",
      recipientAddress: recipient,
      notes: "Test withdrawal from SDK examples",
    });

    console.log("\nWithdrawal request submitted!");
    console.log("Auto Approved:", response.auto_approved);
    console.log("Withdrawal ID:", response.withdrawal.id);
    console.log("Status:", response.withdrawal.status);

    return response;
  } catch (error) {
    console.error("Failed to create withdrawal:", error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  createWithdrawal()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { createWithdrawal };
