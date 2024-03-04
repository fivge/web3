const fs = require("fs");
const solc = require("solc");

const source = fs.readFileSync("contracts/Incrementer.sol", "utf8");

// Compile Contract
// https://docs.soliditylang.org/en/v0.8.0/using-the-compiler.html#compiler-input-and-output-json-description
const input = {
  language: "Solidity",
  sources: {
    "Incrementer.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const tempFile = JSON.parse(solc.compile(JSON.stringify(input)));
const contractOfIncrementer =
  tempFile.contracts["Incrementer.sol"]["Incrementer"];

module.exports = contractOfIncrementer;
