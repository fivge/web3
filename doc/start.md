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
