import { Contract, JsonRpcProvider, formatUnits, parseUnits } from "ethers";
import { EtherSigner } from "@fystack/sdk";
import { credentials, environment, walletId, ethereumRpcUrl } from "../config";

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

const TOKEN_ADDRESS = "0xDD75BEb521f4513D65fFbbE91ab7131f3cD92080";
const SPENDER_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3"; // Uniswap Permit2

async function erc20Approve(
  targetWalletId?: string,
  token = TOKEN_ADDRESS,
  spender = SPENDER_ADDRESS,
  amount = "1"
) {
  console.log("=== ERC20 Approve Example ===\n");

  const wId = targetWalletId || walletId;

  if (!wId) {
    throw new Error(
      "Wallet ID is required. Set WALLET_ID in .env or pass as argument."
    );
  }

  const provider = new JsonRpcProvider(ethereumRpcUrl);

  try {
    const signer = new EtherSigner(credentials, environment, provider);
    signer.setWallet(wId);

    const walletAddress = await signer.getAddress();
    console.log("Wallet Address:", walletAddress);
    console.log("\nConnecting to Ethereum RPC:", ethereumRpcUrl);

    const contract = new Contract(token, ERC20_ABI, signer);
    const [symbol, decimals] = await Promise.all([
      contract.symbol(),
      contract.decimals(),
    ]);

    const currentAllowance = await contract.allowance(walletAddress, spender);
    console.log(`\nToken: ${symbol} (${token})`);
    console.log("Spender:", spender);
    console.log(
      "Current Allowance:",
      formatUnits(currentAllowance, decimals),
      symbol
    );

    console.log(`\nApproving ${amount} ${symbol} for spender...`);
    const tx = await contract.approve(spender, parseUnits(amount, decimals));

    console.log("\nTransaction sent!");
    console.log("Transaction Hash:", tx.hash);
    console.log("Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("\nTransaction confirmed!");
    console.log("Block Number:", receipt?.blockNumber);
    console.log("Gas Used:", receipt?.gasUsed.toString());

    const newAllowance = await contract.allowance(walletAddress, spender);
    console.log("New Allowance:", formatUnits(newAllowance, decimals), symbol);

    return tx;
  } catch (error) {
    console.error("Failed to approve token spending:", error);
    throw error;
  } finally {
    provider.destroy();
  }
}

// Run if executed directly
if (require.main === module) {
  erc20Approve()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { erc20Approve };
