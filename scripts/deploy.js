const { ethers } = require('hardhat');
const items = require('../src/items.json').items;


const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts
  const [deployer] = await ethers.getSigners();

  // Deploy contract
  const Rkart = await ethers.getContractFactory("RKart");
  const rkart = await Rkart.deploy();

  await rkart.deployed();

  console.log("Deployed RKart Contract at: " + rkart.address + " \n" );

  // List items when deploying contracts
  // check "../src/items.json"
  for (let i = 0; i < items.length; i++) {
    const transaction = await rkart.connect(deployer).list(
      items[i].id,
      items[i].name,
      items[i].category,
      items[i].image,
      tokens(items[i].price),
      items[i].rating,
      items[i].stock,
    )
    
    await transaction.wait();

    console.log("Listed item " + items[i].id + ": " +items[i].name);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
