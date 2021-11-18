// node ./src/ethereum/compile.js

const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");
const _ = require("lodash");

const buildPath = path.resolve(__dirname, "build");

const campaignPath = path.resolve(__dirname, "contracts", "BiblionChain.sol");
const source = fs.readFileSync(campaignPath, "utf8");
var input = {
  language: "Solidity",
  sources: {
    "BiblionChain.sol": {
      content: source,
    },
  },
  settings: {
    optimizer: {
      enabled: true,
    },
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

let compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));
for (let contract in compiledContract.contracts["BiblionChain.sol"]) {
  let output = JSON.stringify({
    abi: compiledContract.contracts["BiblionChain.sol"][contract]["abi"],
    bytecode:
      compiledContract.contracts["BiblionChain.sol"][contract]["evm"][
        "bytecode"
      ]["object"],
  });
  fs.writeFileSync(
    path.resolve(buildPath, `${contract.replace(":", "")}.json`),
    output
  );
}
