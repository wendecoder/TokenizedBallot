import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { TokenizedBallot, TokenizedBallot__factory } from "../typechain-types";
dotenv.config();

async function checkVotePower() {
  // Receiving parameters
  const parameters = process.argv.slice(2);
  if (parameters.length < 1) throw new Error("Parameters not defined");
  const WalletPrivateKey = parameters[0];

  // Configuring provider
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ""
  );

  // Configuring Wallet
  const wallet = new ethers.Wallet(WalletPrivateKey ?? "", provider);
  console.log(`Using address ${wallet.address}`);
  const Walletbalance = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(Walletbalance));
  console.log(`Wallet balance ${balance} ETH`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  // Checking vote power for the passed user
  const tokenizedBallotContract = new TokenizedBallot__factory(wallet);
  const tokenizedBallotFactory = tokenizedBallotContract.attach(
    process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS ?? ""
  ) as TokenizedBallot;
  const VotePower = await tokenizedBallotFactory.votingPower(wallet);
  console.log(
    `Voting power of an account with address ${wallet.address} is ${VotePower}.`
  );
}

checkVotePower().catch((error) => {
    console.log(error);
    process.exitCode = 1;
})
