pragma solidity ^0.8.15;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// SPDX-License-Identifier: MIT
contract Spell is ERC721Upgradeable, ERC721PausableUpgradeable, AccessControl {

    bytes32 public constant STORE_ROLE = keccak256("STORE_ROLE");

    string uri;

    constructor(string memory baseUri) ERC721("RebornSpell", "SPEL") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
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
}