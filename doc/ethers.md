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

## advanced
