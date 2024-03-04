const Web3 = require("web3");
const contractFile = require("./compile.simpletoken");

require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_ID = process.env.INFURA_ID;
const receiver = process.env.RECIVE_ACCOUNT;

const CONTRACT_ADDRESS = "0x8A88aBeab3346AE1E77074Df3b6501699FF9cC3e";

//#region 0
// Get abi & bin
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

const Trans = async () => {
  //#region 3
  let deployReceipt = {
    // initToken
    // contractAddress: "",
    // exist token
    contractAddress: CONTRACT_ADDRESS,
  };

  const initToken = async () => {
    const deployContract = new web3.eth.Contract(abi);
    const deployTx = deployContract.deploy({
      data: bytecode,
      arguments: ["梦幻精炼材", "MTOKEN", 0, 999999],
    });
    const deployTransaction = await web3.eth.accounts.signTransaction(
      {
        data: deployTx.encodeABI(),
        gas: "8000000",
      },
      account_from.privateKey
    );

    deployReceipt = await web3.eth.sendSignedTransaction(
      deployTransaction.rawTransaction
    );
    console.log(
      `Contract deployed at address: ${deployReceipt.contractAddress}`
    );
  };

  // initToken
  // await initToken();
  //#endregion

  //#region 4 💖
  const erc20Contract = new web3.eth.Contract(
    abi,
    deployReceipt.contractAddress
  );

  await erc20Contract.methods
    .balanceOf(receiver)
    .call()
    .then((result) => {
      console.log(`The balance of receiver is ${result}`);
    });

  const transferTx = erc20Contract.methods.transfer(receiver, 3).encodeABI();
  const transferTransaction = await web3.eth.accounts.signTransaction(
    {
      to: deployReceipt.contractAddress,
      data: transferTx,
      gas: 8000000,
    },
    account_from.privateKey
  );
  await web3.eth.sendSignedTransaction(transferTransaction.rawTransaction);
  //#endregion

  await erc20Contract.methods
    .balanceOf(receiver)
    .call()
    .then((result) => {
      console.log(`The balance of receiver is ${result}`);
    });
};

Trans()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
