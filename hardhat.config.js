require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-solhint");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-contract-sizer");
require("hardhat-interface-generator");
require('@openzeppelin/hardhat-upgrades');

const { task } = require("hardhat/config");

// const PRIVATE_KEY = process.env.PRIVATE_KEY;
const withOptimizations = true;
const defaultNetwork = "mumbai"; // "hardhat" for tests

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: withOptimizations,
        runs: 200
      }
    }
  },
  defaultNetwork: defaultNetwork,
  paths: {
    artifacts: "./build"
  },
  networks: {
    hardhat: {
      blockGasLimit: 10000000,
      allowUnlimitedContractSize: !withOptimizations
    },
    localhost: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: [
        "cd0764f98516aeee7b09d4caa33a500f02eea15da86739093f8befd097fb9cea",
        "a9f244c1e325d6bc14a2043a7c75a8d4e5aeec238d00700f66bab86716a8eebd"
      ]
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/PZd297vs-VHFPPcF4mRaayWFRgdHKn6I`,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/19de54b594234ffb978a4e81f18a9827`,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/Wv3e5nXZ2iUmDVYSU_ZdcDkCSsIqX9iz`,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD"
  },
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY
  // },
  contractSizer: {
    alphaSort: false,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: false
  },
  mocha: {
    timeout: 9999999999
  }
};
