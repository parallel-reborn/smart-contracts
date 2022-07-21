/** Characters */
const Champion = artifacts.require('Champion')
const Spell = artifacts.require('Spell')
/** Game management */
const Reborn = artifacts.require('Reborn')

const fs = require('fs').promises;

const currentVersion = "v1";

module.exports = async function (deployer, network, accounts) {

    let deployed = {
        version: currentVersion,
        network: network
    }

    /** TOKENS */
    await deployer.deploy(Champion, "")
    let champion = await Champion.deployed()
    console.log("Champion: " + champion.address)
    deployed.champion = champion.address

    await deployer.deploy(Spell, "")
    let spell = await Spell.deployed()
    console.log("Spell: " + spell.address)
    deployed.spell = spell.address

    /** TOKENS */
    await deployer.deploy(Reborn, 8529, champion.address)
    let reborn = await Reborn.deployed()
    console.log("Reborn: " + reborn.address)
    deployed.reborn = reborn.address

    /** Saved Deployment Addresses */
    let path = `deployed/${currentVersion}/${network}`;
    await fs.mkdir(path, {recursive: true}, (err) => {
    });

    await fs.writeFile(`${path}/result.json`, JSON.stringify(deployed))
}