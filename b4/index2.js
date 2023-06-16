const { ethers } = require('ethers');

const contractFile = require('../b3/compile');

require('dotenv').config();
const privatekey = process.env.PRIVATE_KEY;

const receiver = process.env.RECIVE_ACCOUNT;

/*
   -- Define Provider & Variables --
*/
// Provider
const provider = new ethers.InfuraProvider('sepolia', process.env.INFURA_ID);

// Variables
const account_from = {
  privateKey: privatekey,
};

const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

// Create Wallet
let wallet = new ethers.Wallet(account_from.privateKey, provider);

/*
   -- Deploy Contract --
*/
// Create Contract Instance with Signer

const Trans = async () => {
  console.log('===============================1. Deploy Contract');
  console.log(`Attempting to deploy from account: ${wallet.address}`);

  // Send Tx (Initial Value set to 5) and Wait for Receipt
  const deployedContract = {
    getAddress: () => "0x1F144D992dBab38FA27fE35711f608709ea85b68"
  };

  /*
   -- Send Function --
   */
  // Create Contract Instance
  console.log();
  console.log(
    '===============================2. Call Transaction Interface Of Contract'
  );
  const transactionContract = new ethers.Contract(
    await deployedContract.getAddress(),
    abi,
    wallet
  );

  console.log(
    `Transfer 100000 to address: ${receiver}`
  );

  // Call Contract
  const transferReceipt = await transactionContract.transfer(
    receiver,
    100000
  );
  await transferReceipt.wait();

  console.log(`Tx successful with hash: ${transferReceipt.hash}`);

  /*
   -- Call Function --
   */
  // Create Contract Instance
  console.log();
  console.log(
    '===============================3. Call Read Interface Of Contract'
  );
  const providerContract = new ethers.Contract(
    deployedContract.getAddress(),
    abi,
    provider
  );

  // Call Contract
  const balanceVal = await providerContract.balanceOf(
    receiver
  );

  console.log(`balance of ${receiver} is : ${balanceVal}`);

  /*
   -- Listen to Events --
   */
  console.log();
  console.log('===============================4. Listen To Events');

  // Listen to event once
  providerContract.once('Transfer', (from, to, value) => {
    console.log(
      `I am a once Event Listener, I have got an event Transfer, from: ${from}   to: ${to}   value: ${value}`
    );
  });

  // Listen to events continuously
  providerContract.on('Transfer', (from, to, value) => {
    console.log(
      `I am a longstanding Event Listener, I have got an event Transfer, from: ${from}   to: ${to}   value: ${value}`
    );
  });

  // Listen to events with filter
  let topic = ethers.id('Transfer(address,address,uint256)');
  let filter = {
    address: deployedContract.address,
    topics: [topic],
    fromBlock: await provider.getBlockNumber(),
  };

  providerContract.on(filter, (from, to, value) => {
    console.log(
      `I am a filter Event Listener, I have got an event Transfer, from: ${from}   to: ${to}   value: ${value}`
    );
  });

  for (let step = 0; step < 3; step++) {
    let transferTransaction = await transactionContract.transfer(
      receiver,
      10
    );
    await transferTransaction.wait();

    if (step == 2) {
      console.log('Going to remove all Listeners');
      providerContract.removeAllListeners();
    }
  }
};

Trans()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });