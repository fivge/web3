const Web3 = require("web3");
const solc = require("solc");
const fs = require("node:fs");

require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_ID = process.env.INFURA_ID;

//#region 0
// Load contract
const source = fs.readFileSync("contracts/Incrementer.sol", "utf8");

// compile solidity
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
const contractFile = tempFile.contracts["Incrementer.sol"]["Incrementer"];

// Get bin & abi
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;
//#endregion

//#region 1
// Create web3
const web3Api = "https://sepolia.infura.io/v3/" + INFURA_ID;

const web3 = new Web3(web3Api);
//#endregion

//#region 2
// Create account from privatekey
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
const account_from = {
  privateKey: PRIVATE_KEY,
  accountAddress: account.address,
};
//#endregion

//#region 3
/** Deploy Contract */
const Deploy = async () => {
  // Create contract instance
  const deployContract = new web3.eth.Contract(abi);

  // Create Tx
  const deployTx = deployContract.deploy({
    data: bytecode,
    arguments: [0], // Pass arguments to the contract constructor on deployment(_initialNumber in Incremental.sol)
  });

  // Sign Tx
  const deployTransaction = await web3.eth.accounts.signTransaction(
    {
      data: deployTx.encodeABI(),
      gas: 0xf4240,
    },
    account_from.privateKey
  );

  const deployReceipt = await web3.eth.sendSignedTransaction(
    deployTransaction.rawTransaction
  );

  // Your deployed contrac can be viewed at: https://sepolia.etherscan.io/address/${deployReceipt.contractAddress}
  console.log(`Contract deployed at address: ${deployReceipt.contractAddress}`);
  console.log(`blockNumber: ${deployReceipt.blockNumber}`);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
Deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
//#endregion
