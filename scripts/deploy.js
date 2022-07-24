// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const {ethers} = require("hardhat");
const hre = require("hardhat");
const {promises: fs} = require("fs");


// Constants
const network_configs = {
  staging: {
    metadata_uri: "test",
  },
  production : {
    metadata_uri: "production",
  },
  local : {
    metadata_uri: "local",
  },
}
const currentVersion = "v1";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the Assets contract to deploy
  let config;

  if (hre.network.name === "polygon") {
    config = network_configs.production
  } else if (hre.network.name === "mumbai" || hre.network.name === "rinkeby") {
    config = network_configs.staging
  } else {
    await ethers.getSigners()
    config = network_configs.local
  }

  config.network = hre.network.name

  console.log("Network: ", config.network)
  console.log("Metadata URI: ", config.metadata_uri)

  let deployed = {
    version: currentVersion,
    network: hre.network.name
  }

  /** Deploy contracts */

  const Champion = await ethers.getContractFactory("Champion");
  const champion = await Champion.deploy();
  await champion.deployed();
  deployed.champion = champion.address;
  console.log("Champion deployed to:", champion.address);

  const Spell = await ethers.getContractFactory("Spell");
  const spell = await Spell.deploy(config.metadata_uri);
  await spell.deployed();
  deployed.spell = spell.address;
  console.log("Spell deployed to:", spell.address);

  const Reborn = await ethers.getContractFactory("Reborn");
  const reborn = await Reborn.deploy(8529, champion.address);
  await reborn.deployed();
  deployed.reborn = reborn.address;
  console.log("Reborn deployed to:", reborn.address);


  /** Verify the contracts */

  if (config.network !== "localhost") {
    await hre.run("verify:verify", {
      address: deployed.champion,
    });
    await hre.run("verify:verify", {
      address: deployed.spell,
    });
    await hre.run("verify:verify", {
      address: deployed.reborn,
      constructorArguments: [8529, deployed.champion],
    });
  }

  /** Saved Deployment Addresses */
  let path = `deployed/${currentVersion}/${config.network}`;
  await fs.mkdir(path, {recursive: true}, (err) => {
  });

  await fs.writeFile(`${path}/result.json`, JSON.stringify(deployed))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
