pragma solidity ^0.8.15;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Champion.sol";

contract Reborn is VRFConsumerBaseV2, AccessControl {

    Champion _champion;

    //<ChainLink VRF configuration>
    VRFCoordinatorV2Interface cl_sdk;
    uint64 cl_subscriptionId;
    address cl_vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;
    bytes32 cl_keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
    uint32 cl_callbackGasLimit = 100000;
    uint16 cl_requestConfirmations = 3;
    uint32 cl_numRandoms = 5;
    //>

    mapping(uint256 => uint256) _rebornRequests;

    constructor(uint64 subscriptionId, address champion) VRFConsumerBaseV2(vrfCoordinator) {
        _champion = Champion(champion);
        cl_sdk = VRFCoordinatorV2Interface(cl_vrfCoordinator);
        cl_subscriptionId = subscriptionId;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function initiateReborn(address nft, uint256 tokenId) {

        require(ERC721(nft).ownerOf(tokenId) == msg.sender, "Not owner of NFT.");

        uint256 championId = _champion.reborn(nft, tokenId);
        uint256 requestId = cl_sdk.requestRandomWords(
            cl_keyHash,
            cl_subscriptionId,
            cl_requestConfirmations,
            cl_callbackGasLimit,
            cl_numRandoms
        );

        _rebornRequests[requestId] = championId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 championId = _rebornRequests[requestId];
        require(championId != 0, "Champion doesn't exist");
        _champion.accomplishReborn(championId, randomWords[0], randomWords[1], randomWords[2], randomWords[3], randomWords[4]);
    }
}