import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

import { MyToken__factory } from "../typechain-types";

const MINT_VALUE = ethers.parseUnits("10");

async function main() {
    // Configuring the provider
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ""
  );

  // Configuring the wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
  console.log(`Using address ${wallet.address}`);
  const Walletbalance = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(Walletbalance));
  console.log(`Wallet balance ${balance} ETH`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }
  // Deploying the smart contract using Typechain
  const myTokenFactory = new MyToken__factory(wallet);
  const myTokenContract = await myTokenFactory.deploy();
  console.log("Waiting for deployment...");
  await myTokenContract.waitForDeployment();
  console.log(`Contract deployed to ${myTokenContract.target}`);
  const mintTx = await myTokenContract.mint(
    process.env.WALLET_ADDRESS_TO_MINT_TO ?? "",
    MINT_VALUE
  );
  await mintTx.wait();
  console.log(
    `Minted ${MINT_VALUE.toString()} decimal units to account ${process.env.WALLET_ADDRESS_TO_MINT_TO ?? ""}\n`
  );
  const balanceBN = await myTokenContract.balanceOf(
    process.env.WALLET_ADDRESS_TO_MINT_TO ?? ""
  );
  console.log(
    `Account ${process.env.WALLET_ADDRESS_TO_MINT_TO ?? ""} has ${balanceBN.toString()} decimal units of MyToken\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});