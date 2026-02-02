import { config } from "dotenv";
import { Environment, APICredentials } from "@fystack/sdk";

config();

function getEnvVar(name: string, required = true): string {
  const value = process.env[name];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || "";
}

function getEnvironment(): Environment {
  const env = process.env.FYSTACK_ENVIRONMENT || "sandbox";
  switch (env.toLowerCase()) {
    case "production":
      return Environment.Production;
    case "sandbox":
      return Environment.Sandbox;
    case "local":
      return Environment.Local;
    default:
      return Environment.Sandbox;
  }
}

export const credentials: APICredentials = {
  apiKey: getEnvVar("FYSTACK_API_KEY"),
  apiSecret: getEnvVar("FYSTACK_API_SECRET"),
};

export const workspaceId = getEnvVar("FYSTACK_WORKSPACE_ID", false);
export const walletId = getEnvVar("WALLET_ID", false);
export const assetId = getEnvVar("ASSET_ID", false);
export const environment = getEnvironment();

export const ethereumRpcUrl =
  getEnvVar("ETHEREUM_RPC_URL", false) ||
  "https://ethereum-sepolia-rpc.publicnode.com";
export const solanaRpcUrl =
  getEnvVar("SOLANA_RPC_URL", false) || "https://api.devnet.solana.com";

export const ethRecipientAddress = getEnvVar("ETH_RECIPIENT_ADDRESS", false);
export const solanaRecipientAddress = getEnvVar(
  "SOLANA_RECIPIENT_ADDRESS",
  false
);
