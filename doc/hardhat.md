# Hardhat

Hardhat 是一个编译、部署、测试和调试以太坊应用的开发环境。

Hardhat 内置了 Hardhat 网络，这是一个专为开发设计的本地以太坊网络。主要功能有 Solidity 调试，跟踪调用堆栈、console.log()和交易失败时的明确错误信息提示等。

## hardhat

### quick start

```shell
yarn hardhat
yarn hardhat help
yarn hardhat compile
yarn hardhat test
REPORT_GAS=true yarn hardhat test
yarn hardhat node
yarn hardhat run scripts/deploy.ts
yarn hardhat run scripts/deploy.ts --network localhost
```

### OPTIONS

#### `--network`

- `--network localhost`
- `--network hardhat`
- `--network sepolia`

### task

```js
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
```

```shell
yarn hardhat accounts
```

### typescript

```shell
yarn ts-node --files scripts/accounts.ts
```

This can also be enabled with `TS_NODE_FILES=true`

---

<https://hardhat.org/>

## The Graph

```text
    在 Goerli 部署一个合约，并调用触发事件。
    创建定义数据索引的 Subgraph。
    部署 Subgraph 到 TheGraph，实现数据索引。
    在前端 DApp 中查询索引数据。
```

TODO

---

<https://thegraph.com/docs/zh/cookbook/quick-start/>

<https://thegraph.com/studio/>
