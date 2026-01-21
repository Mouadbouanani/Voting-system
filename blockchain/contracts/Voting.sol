pragma solidity ^0.5.16;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    address public admin;
    uint public candidatesCount;

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public hasVoted;

    event CandidateAdded(uint id, string name);
    event Voted(address voter, uint candidateId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() public {
        admin = msg.sender;
    }

    // Admin adds candidates
    function addCandidate(string memory _name) public onlyAdmin {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(
            candidatesCount,
            _name,
            0
        );
        emit CandidateAdded(candidatesCount, _name);
    }

    // Employee votes
    function vote(uint _candidateId) public {
        require(!hasVoted[msg.sender], "You already voted");
        require(
            _candidateId > 0 && _candidateId <= candidatesCount,
            "Invalid candidate"
        );

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit Voted(msg.sender, _candidateId);
    }

    // Get candidate info
    function getCandidate(uint _id)
        public
        view
        returns (uint, string memory, uint)
    {
        Candidate memory c = candidates[_id];
        return (c.id, c.name, c.voteCount);
    }
}
