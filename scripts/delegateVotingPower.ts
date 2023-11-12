import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

import { MyToken, MyToken__factory } from "../typechain-types";

async function delegate() {
  // Receiving parameters
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  const addressToDelegateTo = parameters[0];
  const walletPrivateKey = parameters[1];

  // Configuring the provider
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ""
  );
  // Configuring the contract address
  const contract_address = process.env.MY_TOKEN_CONTRACT_ADDRESS;
  // Configuring the wallet
  const wallet = new ethers.Wallet(walletPrivateKey ?? "", provider);
  console.log(wallet);
  console.log(`Using address ${wallet.address}`);
  const Walletbalance = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(Walletbalance));
  console.log(`Wallet balance ${balance} ETH`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  // Configuring the contract factory and delegating vote power
  const myTokenContract = new MyToken__factory(wallet);
  const myTokenFactory = myTokenContract.attach(
    contract_address ?? ""
  ) as MyToken;
  console.log(
    `Waiting for delegating to the address ${addressToDelegateTo}....`
  );
  const delegateTx = await myTokenFactory.delegate(addressToDelegateTo);
  await delegateTx.wait();
  const votesAfter = await myTokenFactory.getVotes(addressToDelegateTo);
  console.log(
    `Account ${addressToDelegateTo} has ${votesAfter.toString()} units of voting power after delegating\n`
  );
}

delegate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
