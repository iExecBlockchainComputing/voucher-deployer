# Voucher deployer

This project allows deploying iExec voucher related contracts and associated subgraph on a bellecour forked test chain (anvil).

## Build

```sh
docker build . --no-cache -t voucher-deployer
```

## Usage

Prerequisites:

- `bellecour-fork`: ethereum test node (anvil, hardhat) forking bellecour blockchain running
- `graphnode`: thegraph node connected to `bellecour-fork` running
- `ipfs`: ipfs node for subgraph upload running

Environments:

- `RPC_URL`: `bellecour-fork` RPC url
- `FORCE_POCO_UPGRADE`: boolean set it to `true` to force the PoCo upgrade, use this to test next PoCo version (default `false`)
- `VOUCHER_HUB_ADDRESS`: address of an already deployed `VoucherHub`, if set along with `VOUCHER_HUB_START_BLOCK` skips `VoucherHub` deployment (default unset)
- `VOUCHER_HUB_START_BLOCK`: number of the block to start indexing `VoucherHub`, if set along with `VOUCHER_HUB_ADDRESS` skips `VoucherHub` deployment (default unset)
- `SKIP_SUBGRAPH`: boolean set it to `true` to disable the subgraph deployment (default `false`)
- `GRAPHNODE_URL`: `graphnode` admin url
- `IPFS_URL`: `ipfs` admin url

```sh
docker run --rm \
  -e RPC_URL=<bellecour-fork-url> \
  -e GRAPHNODE_URL=<bellecour-fork-graphnode-url> \
  -e IPFS_URL=<ipfs-node-url> \
  -v $PWD/out:/app/out \
  voucher-deployer
```

Output:

- when `FORCE_POCO_UPGRADE` is true (deploy PoCo upgrade)
  - `PoCo.git-log`: git logs PoCo
- when `VOUCHER_HUB_ADDRESS` or `VOUCHER_HUB_START_BLOCK` is not set (deploy VoucherHub)
  - `iexec-voucher-contracts.git-log`: git logs iexec-voucher-contracts
  - `VoucherHub.address`: address of the deployed VoucherHub contract
  - `VoucherHub.block`: block number of VoucherHub contract deployment

## Test

```sh
npm run test
```

this will start a local docker `bellecour-fork`, a `graphnode` and `ipfs` and run the `voucher-deployer`

once finished, the VoucherHub is deployed on `bellecour-fork` at address in `./test/out/VoucherHub.address` and indexed by the subgraph at <http://localhost:8000/subgraphs/bellecour/iexec-voucher/graphql>.

you can interact with the deployed `VoucherHub` using scripts in `test/test-scripts`.

```sh
# install deps
cd test/test-scripts
npm ci
# interact
node createVoucherType.js
node addEligibleAsset.js
node createVoucher.js
# ...
```

terminate the local environment by running

```sh
npm run stop-test-stack
```
