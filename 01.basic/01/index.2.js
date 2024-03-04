const Web3 = require("web3");
const contractOfIncrementer = require("./compile");

require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_ID = process.env.INFURA_ID;

const BLOCK_NUMBER = 5392983;
const CONTRACT_ADDRESS = "0xc2d58E2a78bEc629C49FdD7844329C5931f4Fe7b";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//#region 0
// Get abi & bin
const bytecode = contractOfIncrementer.evm.bytecode.object;
const abi = contractOfIncrementer.abi;
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
  const createReceipt = {
    blockNumber: BLOCK_NUMBER,
    contractAddress: CONTRACT_ADDRESS,
  };

  //#region 3 交易 与合约交互 💖
  let incrementer = new web3.eth.Contract(abi, createReceipt.contractAddress);

  let number = await incrementer.methods.getNumber().call();
  console.log(`The current number stored is: ${number}`);

  const _value = 5;
  let incrementTx = incrementer.methods.increment(_value);
  let incrementTransaction = await web3.eth.accounts.signTransaction(
    {
      to: createReceipt.contractAddress,
      data: incrementTx.encodeABI(),
      gas: 8000000,
    },
    account_from.privateKey
  );
  const incrementReceipt = await web3.eth.sendSignedTransaction(
    incrementTransaction.rawTransaction
  );
  console.log(`Tx successful with hash: ${incrementReceipt.transactionHash}`);

  number = await incrementer.methods.getNumber().call();
  console.log(`After increment, the current number stored is: ${number}`);

  const resetTx = incrementer.methods.reset();
  const resetTransaction = await web3.eth.accounts.signTransaction(
    {
      to: createReceipt.contractAddress,
      data: resetTx.encodeABI(),
      gas: 8000000,
    },
    account_from.privateKey
  );
  const resetcReceipt = await web3.eth.sendSignedTransaction(
    resetTransaction.rawTransaction
  );
  console.log(`Tx successful with hash: ${resetcReceipt.transactionHash}`);

  number = await incrementer.methods.getNumber().call();
  console.log(`After reset, the current number stored is: ${number}`);
  //#endregion

  //#region 4 监听事件 💖
  const web3Socket = new Web3("wss://sepolia.infura.io/ws/v3/" + INFURA_ID);

  // 一次性事件监听器
  incrementer.once("Increment", (error, event) => {
    console.log("I am a onetime event listner, I am going to die now");
  });

  incrementer.events.Increment(() => {
    console.log("I am a longlive event listener, I get a event now");
  });

  // 持续性事件监听器
  web3Socket.eth
    .subscribe(
      "logs",
      {
        address: createReceipt.contractAddress,
        topics: [],
      },
      (error, result) => {
        if (error) {
          console.error(error);
        }
      }
    )
    .on("data", (event) => {
      console.log("New event: ", event);
    })
    .on("error", (error) => {
      console.error("Error: ", error);
    });

  for (let step = 0; step < 3; step++) {
    incrementTransaction = await web3.eth.accounts.signTransaction(
      {
        to: createReceipt.contractAddress,
        data: incrementTx.encodeABI(),
        gas: 8000000,
      },
      account_from.privateKey
    );
    await web3.eth.sendSignedTransaction(incrementTransaction.rawTransaction);

    console.log("Waiting for events");
    await sleep(3000);

    if (step == 2) {
      // clear all the listeners
      web3Socket.eth.clearSubscriptions();
      console.log("Clearing all the events listeners !!!!");
    }
  }

  // getPastEvents
  const pastEvents = await incrementer.getPastEvents("Increment", {
    fromBlock: createReceipt.blockNumber,
    toBlock: "latest",
  });
  console.log("pastEvents:");
  pastEvents.map((event) => {
    console.log(event);
  });

  // 错误处理
  incrementTx = incrementer.methods.increment(0);
  incrementTransaction = await web3.eth.accounts.signTransaction(
    {
      to: createReceipt.contractAddress,
      data: incrementTx.encodeABI(),
      gas: 8000000,
    },
    account_from.privateKey
  );
  await web3.eth
    .sendSignedTransaction(incrementTransaction.rawTransaction)
    .on("error", console.error);
};

Trans()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
