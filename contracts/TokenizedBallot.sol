// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface IMyToken {
    function getPastVotes(address, uint256) external view returns (uint256);
}

contract TokenizedBallot {
    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    bytes32 public constant VOTING_POWER_CALLER_ROLE =
        keccak256("VOTING_POWER_CALLER_ROLE");
    IMyToken public targetContract;
    Proposal[] public proposals;
    uint256 public targetBlockNumber;
    mapping(address => uint256) public remainingVotingPower;

    constructor(
        bytes32[] memory proposalNames,
        IMyToken _targetContract,
        uint256 _targetBlockNumber
    ) {
        targetContract = _targetContract;
        targetBlockNumber = _targetBlockNumber;
        require(
            targetBlockNumber < block.number,
            "TokenizedBallot: targetBlockNumber must be in the past"
        );
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    function vote(uint256 proposal, uint256 amount) external {
        require(
            votingPower(msg.sender) >= amount,
            "TokenizedBallot: trying to vote more than allowed"
        );
        remainingVotingPower[msg.sender] = votingPower(msg.sender) - amount;
        proposals[proposal].voteCount += amount;
    }

    function votingPower(address account) public view returns (uint256) {

        // Check if the user's account exists in the custom mapping
        if (remainingVotingPower[account] > 0) {
            // User's voting power already subtracted, use it directly
            return remainingVotingPower[account];
        } else {
            // User's voting power not subtracted yet, retrieve from getPastVotes
            return targetContract.getPastVotes(account, targetBlockNumber);
            
        }
    }

    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}
