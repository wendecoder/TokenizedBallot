import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { TokenizedBallot, TokenizedBallot__factory } from "../typechain-types";
dotenv.config();

async function queryResult() {
  // Configuring provider
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ""
  );

  // Configuring Wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
  console.log(`Using wallet address ${wallet.address}`);
  const Walletbalance = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(Walletbalance));
  console.log(`Wallet balance ${balance} ETH`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  // Querying Results
  const tokenizedBallotContract = new TokenizedBallot__factory(wallet);
  const tokenizedBallotFactory = tokenizedBallotContract.attach(
    process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS ?? ""
  ) as TokenizedBallot;
  const winningProposal = await tokenizedBallotFactory.winningProposal();
  const winnerName = await tokenizedBallotFactory.winnerName();
  const decodedwinnerName = ethers.decodeBytes32String(winnerName);
  console.log(`Winning Proposal Index: ${winningProposal}`);
  console.log(`Winner Name: ${decodedwinnerName}`);
}

queryResult().catch((error) => {
    console.log(error);
    process.exitCode = 1;
})