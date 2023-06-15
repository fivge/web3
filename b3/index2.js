const Web3 = require("web3");
const contractFile = require("./compile");

require("dotenv").config();
const privatekey = process.env.PRIVATE_KEY;
/*
   -- Define Provider & Variables --
*/

const receiver = process.env.RECIVE_ACCOUNT;

// Provider
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://sepolia.infura.io/v3/" + process.env.INFURA_ID
  )
);

//account
const account = web3.eth.accounts.privateKeyToAccount(privatekey);
const account_from = {
  privateKey: account.privateKey,
  accountaddress: account.address,
};

// sol ---> abi + bin
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

/*
   -- Deploy Contract --
*/
const Trans = async () => {
  // Send Tx and Wait for Receipt
  const deployReceipt = {
    contractAddress: "0xAe67C567aE92283FEaC94Ee00CE4106E485f5683",
  };

  const erc20Contract = new web3.eth.Contract(
    abi,
    deployReceipt.contractAddress
  );

  //build the Tx
  const transferTx = erc20Contract.methods.transfer(receiver, 12).encodeABI();

  // Sign Tx with PK
  const transferTransaction = await web3.eth.accounts.signTransaction(
    {
      to: deployReceipt.contractAddress,
      data: transferTx,
      gas: 8000000,
    },
    account_from.privateKey
  );

  // Send Tx and Wait for Receipt
  await web3.eth.sendSignedTransaction(transferTransaction.rawTransaction);

  await erc20Contract.methods
    .balanceOf(receiver)
    .call()
    .then((result) => {
      console.log(`The balance of receiver is ${result}`);
    })
    .catch((e) => console.log("e", e));
};

Trans()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
