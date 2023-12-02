// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RandomnessBeacon {

    bytes32 private randNumber ;
    uint256 private fixedAmount = 10000 wei;
    uint256 private requiredParties = 3;
    uint256 private revealedParties = 0;
    
    constructor() {
         
    }

    struct Commit {
        address sender;
        bytes32 commit;
        uint64 blockNumber;
        bool revealed ;
    }

    Commit[] public commitHistory;
    mapping(address => Commit) public commits;
 
    struct Reveal {
        address sender;
        uint64 blockNumber;
        bytes32 answer;
    }

    Reveal[] public revealHistory;

    function commit(bytes32 dataHash ) external payable {
        require(msg.value == fixedAmount, "Incorrect payment amount");
        uint64 currentBlock = uint64(block.number);
        commits[msg.sender].commit = dataHash;
        commits[msg.sender].blockNumber = uint64(block.number);
        commits[msg.sender].revealed = false;
        // ****  //
        if (commitHistory.length == requiredParties ) {
            for (uint256 i = 0; i < requiredParties; i++) {
                commitHistory.pop();
            }
        }
        commitHistory.push(Commit({
            sender: msg.sender,
            commit: dataHash,
            blockNumber: currentBlock,
            revealed: false
        }));
        

        // **** //
        emit CommitHash(msg.sender, commits[msg.sender].commit, commits[msg.sender].blockNumber);
    }

    event CommitHash(address sender, bytes32 dataHash, uint64 blockNumber);

    function reveal(bytes32 answer , bytes32 salt) external {
        require(!commits[msg.sender].revealed, "Already revealed");
        commits[msg.sender].revealed = true;


        // emit DebugEvents("The Hash of reveal", getHash(answer));        
          
        require(getSaltedHash(answer ,salt) == commits[msg.sender].commit, "Revealed hash does not match commit");
        

        require(uint64(block.number) > commits[msg.sender].blockNumber, "Reveal and commit happened on the same block");
        require(uint64(block.number) <= commits[msg.sender].blockNumber + 10, "Revealed too late");

        randNumber ^= answer;
        
        revealedParties++ ;

        // Refund the fixed amount
        payable(msg.sender).transfer(fixedAmount);
        uint64 currentBlock = uint64(block.number);

        emit RevealHash(msg.sender, answer);

        // ****  //

        if (revealHistory.length == requiredParties ) {
            for (uint256 i = 0; i < requiredParties; i++) {
                revealHistory.pop();
            }
        }

        revealHistory.push(Reveal({
            sender: msg.sender,
            answer: answer,
            blockNumber: currentBlock
        }));

        

        // *****  //
        // emit DebugEvents1("No of Perties revealed :", revealedParties);
        // emit DebugEvents("The random Number using revealed values :", randNumber);
        
        if(revealedParties == requiredParties){
            emit RandomNumber(randNumber);
            // emit DebugEvents("The random Number inside IF statement :", randNumber);
            randNumber = 0;
            revealedParties = 0;
        }

         
        // emit DebugEvents("The random number :", randNumber);

    }


    // event DebugEvents1(string message , uint256 number);
    // event DebugEvents(string message , bytes32 Hash);
    event RevealHash(address sender, bytes32 revealAns);
    event RandomNumber(bytes32 randNumber);

    function getHash(bytes32 data) public view returns (bytes32) {
        return keccak256(abi.encodePacked(address(this), data));
    }

    function getSaltedHash(bytes32 data, bytes32 salt) public view returns (bytes32) {
        return keccak256(abi.encodePacked(address(this), data, salt));
    }

    //  ****  //

    function getCommits() external view returns (Commit[] memory) {
        return commitHistory;
    }

    function getReveals() external view returns (Reveal[] memory) {
        return revealHistory;
    }

    //  ****  //
}
