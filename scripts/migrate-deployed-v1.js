const fs = require('fs').promises;
const currentVersion = "v1";
let network = "development";

let path = `deployed/${currentVersion}/${network}`;

const migrate = async function () {
    await fs.mkdir(path, {recursive: true}, (err) => {
    });

    await fs.copyFile("build/contracts/Champion.sol/Champion.json", `${path}/Champion.json`);
    await fs.copyFile("build/contracts/Reborn.sol/Reborn.json", `${path}/Reborn.json`);
    await fs.copyFile("build/contracts/Spell.sol/Spell.json", `${path}/Spell.json`);
}

migrate()