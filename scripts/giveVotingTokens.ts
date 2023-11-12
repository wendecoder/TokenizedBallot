import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

import { MyToken, MyToken__factory } from "../typechain-types";

async function main() {
  // Receiving parameters
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  console.log(`Wallet to mint the tokens to: ${parameters[0]}`);
  console.log(`Amount of tokens to mint: ${parameters[1]}`);
  const WALLET_TO_MINT_TO = parameters[0];
  console.log(WALLET_TO_MINT_TO);
  const MINT_VALUE_PARAMETER = parameters[1];
  const MINT_VALUE = ethers.parseUnits(MINT_VALUE_PARAMETER);
  // Configuring the provider
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ""
  );

  const contract_address = process.env.MY_TOKEN_CONTRACT_ADDRESS;
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
  const myTokenContract = (await myTokenFactory.attach(
    contract_address ?? ""
  )) as MyToken;
  console.log(myTokenContract.target);
  console.log(
    `Waiting for minting ${MINT_VALUE} tokens to address ${parameters[0]}...`
  );
  const mintTx = await myTokenContract.mint(
    WALLET_TO_MINT_TO ?? "",
    MINT_VALUE
  );
  await mintTx.wait();
  console.log(
    `Minted ${MINT_VALUE.toString()} decimal units to account ${
      WALLET_TO_MINT_TO ?? ""
    }\n`
  );
  const balanceBN = await myTokenContract.balanceOf(
    process.env.WALLET_ADDRESS_TO_MINT_TO2 ?? ""
  );
  console.log(
    `Account ${
      WALLET_TO_MINT_TO ?? ""
    } has ${balanceBN.toString()} decimal units of MyToken\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
