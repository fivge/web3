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

### 任务 task

> 简写

```js
import { task } from "hardhat/config";

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

> 带参数 `addParam`

```typescript
import { task } from "hardhat/config";

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs, hre) => {
    const balance = await hre.ethers.provider.getBalance(taskArgs.account);

    console.log(hre.ethers.utils.formatEther(balance), "ETH");
  });
```

```shell
yarn hardhat balance --help
```

```text
Usage: hardhat [GLOBAL OPTIONS] balance --account <STRING>

OPTIONS:

  --account     The account's address

balance: Prints an account's balance
```

> 可选参数 `addOptionalParam`

```typescript
task("hello", "Prints a greeting")
  .addOptionalParam("greeting", "The greeting to print", "Hello, World!")
  .setAction(async ({ greeting }) => console.log(greeting));
```

```shell
yarn hardhat hello
# Hello, World!

yarn hardhat hello --greeting foo
# foo
```

> 子任务 `subtask`

```typescript
import { task, subtask } from "hardhat/config";

task("hello-world", "Prints a hello world message").setAction(
  async (taskArgs, hre) => {
    await hre.run("print", { message: "Hello, World!" });
  }
);

subtask("print", "Prints a message")
  .addParam("message", "The message to print")
  .setAction(async (taskArgs) => {
    console.log(taskArgs.message);
  });
```

- <https://hardhat.org/hardhat-runner/docs/advanced/create-task>

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

## fe

TODO

`chainId`

<https://docs.metamask.io/wallet/how-to/send-transactions/#chain-id>

```json
{
  "code": "UNKNOWN_ERROR",
  "error": {
    "code": -32603,
    "message": "[ethjs-query] while formatting outputs from RPC '{\"value\":{\"code\":-32603,\"data\":{\"code\":-32602,\"message\":\"Trying to send a raw transaction with an invalid chainId. The expected chainId is 31337\",\"data\":{\"message\":\"Trying to send a raw transaction with an invalid chainId. The expected chainId is 31337\"}}}}'"
  }
}
```

---

<https://docs.metamask.io/wallet/get-started/set-up-dev-environment/>
