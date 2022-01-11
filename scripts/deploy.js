
const delay = ms => new Promise(res => setTimeout(res, ms));

const main = async () => {
    
    const remoteFactory = await ethers.getContractFactory("Implementation");
    Implementation = await remoteFactory.deploy();
    await Implementation.deployed();

    const proxyFactory = await ethers.getContractFactory("SimpleProxy");
    SimpleProxy = await proxyFactory.deploy();
    await SimpleProxy.deployed();

    console.log("  Implementation:", Implementation.address)
    console.log("  SimpleProxy:   ", SimpleProxy.address)

    console.log("Waiting for bytecode to propogate (60sec)");
    await delay(60000);

    console.log("Verifying on Etherscan");

    await hre.run("verify:verify", {
        address: Implementation.address,
      });

      await hre.run("verify:verify", {
        address: SimpleProxy.address,
      });

    console.log("Verified on Etherscan");

    const ProxyAsImplementation = Implementation.attach(SimpleProxy.address)
    await ProxyAsImplementation.gm()
    console.log("SimpleProxy emit gm_fren()");
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();