const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledBiblionChain = require("./build/BiblionChain.json");

// HDWalletProvider specifies which account we want to unlock/use as a source of Ether
// Also specifies the node we will use to deploy the contract

const provider = new HDWalletProvider(
  "pepper thought lesson river radio blossom shadow disease task bid depend pave", // metamask mnemonic
  "https://rinkeby.infura.io/v3/0a44a6461ea44cc8b26e918758811c53" // from Infura
);
const web3 = new Web3(provider);

const deploy = async () => {
  // Get list of unlocked accounts (since each mnemonic / metamask login has a bunch of associated accounts)
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(compiledBiblionChain.abi)
    .deploy({ data: compiledBiblionChain.bytecode })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to (address):", result.options.address);
};
deploy();

// Initial contract deployed to: 0x8E75A4f47D1BAD072198cc0b7E0f2fE0892140F6
// Contract 2.0 deployed to: 0x81240c5C2d5537Df783C20D5dbb71AE43f9eca0F
