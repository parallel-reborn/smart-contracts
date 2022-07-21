pragma solidity ^0.8.15;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// SPDX-License-Identifier: MIT
contract Champion is ERC721Upgradeable, ERC721PausableUpgradeable, AccessControl {

    bytes32 public constant REBORN_ROLE = keccak256("REBORN_ROLE");

    struct Champion {
        uint256 fire;
        uint256 earth;
        uint256 water;
        uint256 light;
        uint256 class;
        uint256 tokenId;
        address nft;
    }

    string __baseURI;

    mapping(uint256 => Champion) _champions;

    constructor(string memory baseUri) ERC721("RebornChampion", "CHAMP") {
        __baseURI = baseUri;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function reborn(address nft, uint256 tokenId) external onlyRole(REBORN_ROLE) returns (uint256) {
        uint256 uniqueId = singleID(nft, tokenId);
        Champion memory champion = _champions[uniqueId];

        if (champion.tokenId != 0) {
            return uniqueId;
        }

        _champions[uniqueId] = Champion({nft : nft, tokenId : tokenId});
        _safeMint(msg.sender, uniqueId);

        emit NewChampion(championId);
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

    function _baseURI() internal view override(ERC721Upgradeable) returns (string memory) {
        return __baseURI;
    }

    function singleID(address nft, uint256 tokenId) external view returns (uint256) {
        return keccak256(abi.encodePacked(nft, id));
    }

    function pause() external onlyMaintainer {
        _pause();
    }

    function unpause() external onlyMaintainer {
        _unpause();
    }

    function setBaseURI(string memory newBaseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        __baseURI = newBaseURI;
    }

    event NewChampion(uint256 indexed championId);
    event ChampionReborn(uint256 indexed championId);
}