const Web3 = require("web3");
const solc = require("solc");
const fs = require("node:fs");
// Get privatekey from environment
require("dotenv").config();
const privatekey = process.env.PRIVATE_KEY;

// const web3Api = "https://goerli.infura.io/v3/" + process.env.INFURA_ID;
const web3Api = "https://sepolia.infura.io/v3/" + process.env.INFURA_ID;

// Load contract
const source = fs.readFileSync("Incrementer.sol", "utf8");

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

// Create web3 with goerli provider，you can change goerli to other testnet
const web3 = new Web3(web3Api);

// Create account from privatekey
const account = web3.eth.accounts.privateKeyToAccount(privatekey);
const account_from = {
  privateKey: privatekey,
  accountAddress: account.address,
};

/*
   -- Deploy Contract --
*/
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

  console.log("deployTransaction", deployTransaction);

  const deployReceipt = await web3.eth.sendSignedTransaction(
    deployTransaction.rawTransaction
  );

  // Your deployed contrac can be viewed at: https://goerli.etherscan.io/address/${deployReceipt.contractAddress}
  // You can change goerli in above url to your selected testnet.
  // sepolia
  console.log(`Contract deployed at address: ${deployReceipt.contractAddress}`);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
Deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
