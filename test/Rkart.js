/* eslint-disable jest/valid-expect */
const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
}

// Global constants for listing an item...
const ID = 0.00001;
const NAME = "Camera";
const CATEGORY = "gadgets";
const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/camera.jpg" ;
const COST = tokens(1);
const RATING = 4;
const STOCK = 10;

describe("Rkart", () => {

  let rkart, deployer, buyer, transaction;
  let balanceBefore;

  beforeEach(async ()=>{
    
    // Setup Accounts
    [deployer, buyer] = await ethers.getSigners();
    //console.log(deployer, buyer);
    
    // Deploy contract
    const Rkart = await ethers.getContractFactory("RKart");
    rkart = await Rkart.deploy();

  })

  describe("Deployment", () => {
    
    it("Has a name", async () => {
      const name = await rkart.name();
      
      expect(await name).to.equal("RKart")
    })
    
    it("Sets the owner", async () => {
      expect(await rkart.owner()).to.equal(deployer.address)
    })
    
  })

  describe("Listing", () => {
    
    beforeEach(async ()=>{
      transaction = await rkart.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();
  
    })
    
    it("Returns item attributes", async () => {
      // Read from mapping (items)
      const item = await rkart.items(ID);

      expect(item.id).to.equal(ID);
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.image).to.equal(IMAGE);
      expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK);

    })

    // Emits List Event       
    it("Emits List event", () => {
      expect(transaction).to.emit(rkart, "List");
    })

  })
  
  // Buying
  describe("Buying", () => {
    
    beforeEach(async ()=>{
      //List an item
      transaction = await rkart.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();
      
      // Buy an item
      transaction = await rkart.connect(buyer).buy(ID , {value : COST});
      await transaction.wait();
  
    })
    
    it("Updates buyer's order count", async () => {
      const result = await rkart.orderCount(buyer.address);
      expect(result).to.equal(1);
    })

    it("Adds the order", async () => {
      const order = await rkart.orders(buyer.address, 1);

      expect(order.time).to.be.greaterThan(0);
      expect(order.item.name).to.equal(NAME);
    })

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(rkart.address);
      expect(result).to.equal(COST);
    })

    it("Emits Buy event", () => {
      expect(transaction).to.emit(rkart, "Buy");
    })

  })


  describe("Withdrawing", () => {
    
    beforeEach(async () => {
      
      // List an item
      let transaction = await rkart.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();

      // Buy a item
      transaction = await rkart.connect(buyer).buy(ID, { value: COST });
      await transaction.wait();

      // Get Deployer balance before
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      // Withdraw crypto
      transaction = await rkart.connect(deployer).withdraw()
      await transaction.wait()
    })

    // Updates Balance Before
    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    // Balance should be ZERO
    it('Updates the contract balance', async () => {
      const result = await ethers.provider.getBalance(rkart.address)
      expect(result).to.equal(0)
    })
  })

})


