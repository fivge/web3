# ethers

## quick start

## basic

> getSigners

```typescript
const [deployer] = await ethers.getSigners();

deployer.address;
```

> deployContract

```typescript
const token = await ethers.deployContract("SimpleToken", [
  "SimpleToken",
  "ST",
  18,
  10000000000,
]);

await token.waitForDeployment();

await token.getAddress();

let balance = await token.balanceOf(deployer.address);
```

> getContractAt address

```typescript
const token = await ethers.getContractAt(
  "SimpleToken",
  "0x12A517F5364c5475E5Bd18348e48178b24BceD60"
);
```

<https://ethereum.org/zh/developers/tutorials/transfers-and-approval-of-erc-20-tokens-from-a-solidity-smart-contract/>

## advanced
