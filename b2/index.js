const Web3 = require("web3");
const contractOfIncrementer = require("./compile");

require("dotenv").config();
const privatekey = process.env.PRIVATE_KEY;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const providerRPC = {
  development: "https://sepolia.infura.io/v3/" + process.env.INFURA_ID,
  moonbase: "https://rpc.testnet.moonbeam.network",
};
const web3 = new Web3(providerRPC.development);

// Create account with privatekey
const account = web3.eth.accounts.privateKeyToAccount(privatekey);
const account_from = {
  privateKey: privatekey,
  accountAddress: account.address,
};

// Get abi & bin
const bytecode = contractOfIncrementer.evm.bytecode.object;
const abi = contractOfIncrementer.abi;

const Trans = async () => {
  const createReceipt = {
    blockNumber: 3688266,
    contractAddress: "0x970d40f94dd0ea7B80D658988679658D643f6c52",
  };

  const deployedBlockNumber = createReceipt.blockNumber;

  let incrementer = new web3.eth.Contract(abi, createReceipt.contractAddress);

  let number = await incrementer.methods.getNumber().call();
  console.log(`The current number stored is: ${number}`);

  const _value = 3;
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

  number = await incrementer.methods.getNumber().call();
  console.log(`After increment, the current number stored is: ${number}`);

  // const resetTx = incrementer.methods.reset();
  // const resetTransaction = await web3.eth.accounts.signTransaction(
  //   {
  //     to: createReceipt.contractAddress,
  //     data: resetTx.encodeABI(),
  //     gas: 8000000,
  //   },
  //   account_from.privateKey
  // );
  // const resetcReceipt = await web3.eth.sendSignedTransaction(
  //   resetTransaction.rawTransaction
  // );

  // number = await incrementer.methods.getNumber().call();
  // console.log(`After reset, the current number stored is: ${number}`);

  const web3Socket = new Web3(
    "wss://sepolia.infura.io/ws/v3/" + process.env.INFURA_ID
  );

  incrementer.once("Increment", (error, event) => {
    console.log("I am a onetime event listner, I am going to die now");
  });

  // listen to Increment event continuously
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

  const pastEvents = await incrementer.getPastEvents("Increment", {
    fromBlock: deployedBlockNumber,
    toBlock: "latest",
  });

  pastEvents.map((event) => {
    console.log(event);
  });

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
