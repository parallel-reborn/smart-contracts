pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// SPDX-License-Identifier: MIT
contract Champion is AccessControl {

    bytes32 public constant REBORN_ROLE = keccak256("REBORN_ROLE");

    struct Profile {
        uint256 fire;
        uint256 earth;
        uint256 water;
        uint256 light;
        uint256 class;
        uint256 tokenId;
        address nft;
    }

    event NewChampion(uint256 indexed championId);
    event ChampionReborn(uint256 indexed championId);


    mapping(uint256 => Profile) _champions;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function reborn(address nft, uint256 tokenId) external onlyRole(REBORN_ROLE) returns (uint256) {
        uint256 uniqueId = singleID(nft, tokenId);
        Profile memory champion = _champions[uniqueId];

        if (champion.tokenId != 0) {
            return uniqueId;
        }

        _champions[uniqueId].nft = nft;
        _champions[uniqueId].tokenId = tokenId;

        emit NewChampion(uniqueId);
        return uniqueId;
    }

    function accomplishReborn(uint256 championId, uint256 fire, uint256 earth, uint256 water, uint256 light, uint256 class) external onlyRole(REBORN_ROLE) {
        _champions[championId].fire = fire % 100;
        _champions[championId].earth = earth % 100;
        _champions[championId].water = water % 100;
        _champions[championId].light = light % 100;
        _champions[championId].class = class % 2;

        emit ChampionReborn(championId);
    }

    function singleID(address nft, uint256 tokenId) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(nft, tokenId)));
    }
}