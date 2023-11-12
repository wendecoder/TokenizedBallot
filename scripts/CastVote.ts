import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

import { TokenizedBallot, TokenizedBallot__factory } from "../typechain-types";

async function castVote() {
  // Receiving parameters
  const parameters = process.argv.slice(2);
  if (parameters.length < 3) throw new Error("Parameters not found");
  const walletPrivateKey = parameters[0];
  const indexOfProposalToGiveVote = parameters[1];
  const amountOfVotingPowerToCast = parameters[2];
  const parsedAmounOfVotingPowerToCast = ethers.parseUnits(amountOfVotingPowerToCast)

  // Configuring providers
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ""
  );
  // Configuring Wallet
  const wallet = new ethers.Wallet(walletPrivateKey ?? "", provider);
  console.log(`Using address ${wallet.address}`);
  const Walletbalance = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(Walletbalance));
  console.log(`Wallet balance ${balance} ETH`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  // Configuring contract factory and casting vote
  const tokenizedBallotContract = new TokenizedBallot__factory(wallet);
  const tokenizedBallotFactory = tokenizedBallotContract.attach(
    process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS ?? ""
  ) as TokenizedBallot;
  const votesBefore = await tokenizedBallotFactory.votingPower(wallet);
  console.log(
    `Voting power of address ${wallet.address} before voting is ${votesBefore.toString()}.\n`
  );
  console.log(`Voting for proposal at index ${indexOfProposalToGiveVote}....`);
  const voteTx = await tokenizedBallotFactory.vote(
    indexOfProposalToGiveVote,
    parsedAmounOfVotingPowerToCast
  );
  await voteTx.wait();
  const votesAfter = await tokenizedBallotFactory.votingPower(wallet);
  console.log(
    `Voting power of address ${wallet.address} after voting is ${votesAfter.toString()}.\n`
  );
}

castVote().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
