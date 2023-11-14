# TokenizedBallot
The `TokenizedBallot` smart contract facilitates tokenized voting using the ERC-20 token `MyToken`. Leveraging the OpenZeppelin libraries, it implements delegation, voting, and access control features. The contract takes a snapshot of voting power at deployment, preventing users from obtaining additional power post-snapshot. Users can cast votes with a limit, tracked through a remainingVotingPower map, ensuring fairness and transparency in the voting process.

## Libraries

- **Ethers**: Used for interacting with Ethereum smart contracts and the Ethereum blockchain. [Link to Ethers](https://docs.ethers.io/v5/)

- **Hardhat**: Employed as the development environment for compiling, testing, and deploying smart contracts. [Link to Hardhat](https://hardhat.org/)

- **OpenZeppelin Contracts**: Integrated for utilizing standardized and secure smart contract components, including ERC-20 and access control. [Link to OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
  


## Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/wendecoder/TokenizedBallot.git
   cd your-repo
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   
3. **Compile Smart Contracts**
   ```bash
   npx hardhat compile
   ```

4. **Set Up Environment Variables:**
   Create a `.env` file in the project root with the following variables:
   ```env
   PRIVATE_KEY=your_private_key
   RPC_ENDPOINT_URL=your_rpc_endpoint_url
   WALLET_ADDRESS_TO_MINT_TO=your_wallet_address
   MY_TOKEN_CONTRACT_ADDRESS=your_my_token_contract_address
   TOKENIZED_BALLOT_CONTRACT_ADDRESS=your_tokenized_ballot_contract_address
   ```

5. **Run the Scripts:**

   - **Deploy MyToken contract:**
     ```bash
     npx ts-node scripts/deployMyToken.ts
     ```

   - **Deploy TokenizedBallot contract:**
     ```bash
     npx ts-node scripts/deployTokenizedBallot.ts Proposal1 Proposal2 Proposal3
     ```

     Note: Replace "Proposal1", "Proposal2", "Proposal3" with your actual proposal names.

   - **Giving voting tokens for voters:**
     ```bash
     npx ts-node scripts/giveVotingTokens.ts <wallet_to_mint_to> <amount_of_tokens>
     ```

   - **Delegating vote:**
     ```bash
     npx ts-node scripts/delegateVote.ts <address_to_delegate_to> <wallet_private_key>
     ```

   - **Casting vote:**
     ```bash
     npx ts-node scripts/castVote.ts <wallet_private_key> <index_of_proposal> <amount_of_voting_power_to_cast>
     ```

   - **Checking voting power left:**
     ```bash
     npx ts-node scripts/checkVotePower.ts <wallet_private_key>
     ```

   - **Querying result:**
     ```bash
     npx ts-node scripts/queryResult.ts
     ```
**Happy Voting**
