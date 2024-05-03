# Voucher deployer

This project allow deploying iExec voucher related contracts and associated subgraph on a bellecour forked test chain (anvil).

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

- RPC_URL: `bellecour-fork` RPC url
- GRAPHNODE_URL: `graphnode` admin url
- IPFS_URL: `ipfs` admin url

```sh
docker run --rm \
  -e RPC_URL=<bellecour-fork-url> \
  -e GRAPHNODE_URL=<bellecour-fork-graphnode-url> \
  -e IPFS_URL=<ipfs-node-url> \
  -v $PWD/out:/app/out \
  voucher-deployer
```

## Test

```sh
docker compose -f docker-compose.test.yml up
```
