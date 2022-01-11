import chai, { expect } from 'chai'
import { solidity } from 'ethereum-waffle'
import { ethers } from 'hardhat'
import { Contract } from 'ethers'
chai.use(solidity)

describe('AccessControl',() => {

  let owner: any
  let SimpleProxy: Contract
  let Implementation: Contract
  let ProxyAsImplementation: Contract

  before(async () => {
    [owner] = await ethers.getSigners();

    const remoteFactory = await ethers.getContractFactory("Implementation");
    Implementation = await remoteFactory.deploy();
    await Implementation.deployed();

    const proxyFactory = await ethers.getContractFactory("SimpleProxy");
    SimpleProxy = await proxyFactory.deploy();
    await SimpleProxy.deployed();

    ProxyAsImplementation = Implementation.attach(SimpleProxy.address)

    console.log("  Implementation:", Implementation.address)
    console.log("  SimpleProxy:   ", SimpleProxy.address)
  })

  describe('construction', async () => {

    it('SimpleProxy.getRemote should match Implementation.address', async() => {
      await SimpleProxy.setRemote(Implementation.address);

      let proxyTarget = await SimpleProxy.getRemote()
      expect(proxyTarget).to.hexEqual(Implementation.address)
    })
  })

  describe('proxying works', async () => {
    it('SimpleProxy.gm should call Implementation.gm', async() => {
      expect(await ProxyAsImplementation.gm()).to.emit(ProxyAsImplementation,"gm_fren");
    })
  })

})