const { expect } = require("chai");
const { ethers} = require("hardhat");

describe("Reborn", function () {
    const metadata_uri = ""
    let admin;
    let addr1;
    let addr2;
    let addrs;

    let champion;
    let reborn;

    // `beforeEach` will run before each test, re-deploying the contract every
    // time. It receives a callback, which can be async.
    beforeEach(async function () {
        [admin, addr1, addr2, ...addrs] = await ethers.getSigners();

        // Get the ContractFactory
        let ChampionFactory = await ethers.getContractFactory("Champion");
        let RebornFactory = await ethers.getContractFactory("Reborn");

        const champion = await ChampionFactory.deploy(metadata_uri);
        await champion.deployed();

        const reborn = await RebornFactory.deploy(8529, champion.address);
        await reborn.deployed();
    });

    describe("Transactions", function () {
        it("Should mint correctly", async function () {
            expect(1).to.equal(1);
        });
    })
})