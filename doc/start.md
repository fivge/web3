### 0x01 合约编译及部署

#### 1. 合约

##### 合约 contract

`solidity` `.sol`

##### 把 sol 源码编译为 solidity 对象

```js
// Load contract
const source = fs.readFileSync("./b1/Incrementer.sol", "utf8");

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
```

##### 合约对象的二进制, abi 属性值 (bin & abi ) (Contract Application Binary Interface)

```js
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;
```

#### 2. Web3

##### web3 对象

```js
const web3Api = "https://sepolia.infura.io/v3/" + process.env.INFURA_ID;

const web3 = new Web3(web3Api);
```

区块链网络

用户都有一个对应的账户地址, 私钥

```js
const account = web3.eth.accounts.privateKeyToAccount(privatekey);
const account_from = {
  privateKey: privatekey,
  accountAddress: account.address,
};
```

#### 3. 部署合约

合约实例

```js
const deployContract = new web3.eth.Contract(abi);
```

> 通过合约实例进行交易的发送

```js
// 创建合约交易
const deployTx = deployContract.deploy({
  data: bytecode,
  arguments: [0], // Pass arguments to the contract constructor on deployment(_initialNumber in Incremental.sol)
});

// 交易签名
const deployTransaction = await web3.eth.accounts.signTransaction(
  {
    data: deployTx.encodeABI(),
    gas: 0xf4240,
  },
  account_from.privateKey
);

// 部署合约
const deployReceipt = await web3.eth.sendSignedTransaction(
  deployTransaction.rawTransaction
);
```

**部署的合约的地址**

`deployReceipt.contractAddress`

`https://goerli.etherscan.io/address/${deployReceipt.contractAddress}`

### 0x02 交易和事件

> 对交易进行签名，发送，接收交易回执，验证交易执行结果

> 对一个事件进行一次或多次监听

#### 1. 加载合约实例

https://sepolia.etherscan.io/address/0x970d40f94dd0ea7B80D658988679658D643f6c52

3688266

```js
let incrementer = new web3.eth.Contract(abi, createReceipt.contractAddress);
```

#### 2. 与合约交互

在拥有一个已经上链的合约实例后, 就可以和合约进行交互

合约接口分为只读和交易接口, 其中只读接口不会产生区块, 而交易接口调用会在区块链网络上产生相应的区块数据

```js
// 只读
let number = await incrementer.methods.getNumber().call();
console.log(`The current number stored is: ${number}`);

// 交易
let incrementTx = incrementer.methods.increment(5);
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
```

构造交易 -> 发送交易并获取回执

#### 3. 监听事件

- 一次性事件监听器
- 持续性事件监听器

```js
const web3Socket = new Web3(
  "wss://sepolia.infura.io/ws/v3/" + process.env.INFURA_ID
);

incrementer.once("Increment", (error, event) => {
  console.log("I am a onetime event listner, I am going to die now");
});
```

```js
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

web3Socket.eth.clearSubscriptions();
```

```js
const pastEvents = await incrementer.getPastEvents("Increment", {
  fromBlock: deployedBlockNumber,
  toBlock: "latest",
});

pastEvents.map((event) => {
  console.log(event);
});
```

- 错误处理

```js
await web3.eth
  .sendSignedTransaction(incrementTransaction.rawTransaction)
  .on("error", console.error);
```

### 0x03 ERC20 合约

<https://ethereum.org/zh/developers/docs/standards/tokens/erc-20/>

基本调用

#### 1. 构造转账交易

```js
const transferTx = erc20Contract.methods.transfer(receiver, 12).encodeABI();
const transferTransaction = await web3.eth.accounts.signTransaction(
  {
    to: deployReceipt.contractAddress,
    data: transferTx,
    gas: 8000000,
  },
  account_from.privateKey
);
await web3.eth.sendSignedTransaction(transferTransaction.rawTransaction);
```

#### 2. 验证转账后余额

```js
await erc20Contract.methods
  .balanceOf(receiver)
  .call()
  .then((result) => {
    console.log(`The balance of receiver is ${result}`);
  });
```
