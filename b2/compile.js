const fs = require("fs");
const solc = require("solc");

const source = fs.readFileSync("./b2/Incrementer.sol", "utf8");

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

// 导出合约数据，可以使用 console 打印 contractFile 中的具体内容信息
// console.log("contractOfIncrementer,", contractOfIncrementer);
module.exports = contractOfIncrementer;
