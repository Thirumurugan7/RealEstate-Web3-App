const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Escrow", () => {
  let buyers, seller, inspector, lender;
  let realEstate, escrow;
  beforeEach(async () => {
    [buyer, seller, inspector, lender] = await ethers.getSigners();

    //deploy the contract
    const RealEstate = await ethers.getContractFactory("RealEstate");
    realEstate = await RealEstate.deploy();
    //console.log(realEstate.address);
    //Mint
    let transaction = await realEstate
      .connect(seller)
      .mint(
        "https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS"
      );
    await transaction.wait();

    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(
      realEstate.address,
      inspector.address,
      seller.address,
      lender.address
    );

    //Aprove property
    //approve function from erc721
    //this function has to be executed so that ownerOf function can be executed without error
    transaction = await realEstate.connect(seller).approve(escrow.address, 1);
    await transaction.wait();

    // List properties

    transaction = await escrow.connect(seller).list(1);
    await transaction.wait();
  });
  describe("Deployment", () => {
    it("returns the contract address", async () => {
      const result = await escrow.nftAddress();
      expect(result).to.be.equal(realEstate.address);
    });
    it("returns seller", async () => {
      const result = await escrow.seller();
      expect(result).to.be.equal(seller.address);
    });
    it("returns the inspector address", async () => {
      const result = await escrow.inspector();
      expect(result).to.be.equal(inspector.address);
    });
    it("returns the lender address", async () => {
      const result = await escrow.lender();
      expect(result).to.be.equal(lender.address);
    });
  });

  describe("listing", async () => {
    it("Updated as listed", async () => {
      const result = await escrow.isListed(1);
      expect(result).to.be.equal(true);
    });
    it("Updates ownerships", async () => {
      //ownerof function comes from erc721
      expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address);
    });
  });
});
