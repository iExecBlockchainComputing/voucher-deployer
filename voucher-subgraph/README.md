# voucher-subgraph

A subgraph indexing `iexec-voucher-contracts`

NB:

- :warning: [`iexec-voucher-contracts`](https://github.com/iExecBlockchainComputing/iexec-voucher-contracts) is still under development, run `refresh-abis.sh` to get the latest ABI changes from the `develop` branch.

## build

```sh
# install deps
npm ci

# generate code from the ABIs
npm run codegen

# build
npm run build
```

## deploy

Prerequisites:

- `bellecour` RPC node (can be a test node)
- `VoucherHub` contract deployed on RPC node's network
- IPFS node with access to admin API
- graphnode connected to network `bellecour` with access to admin API

```sh
# set VoucherHub deployment details
export VOUCHER_HUB_ADDRESS="0x..."
export VOUCHER_HUB_START_BLOCK=1234

# set deployment urls
export IPFS_URL="http://localhost:5001"
export GRAPHNODE_URL="http://localhost:8020"

# generate code from the ABIs
npm run codegen

# build
npm run build

# deploy
npm run create
npm run deploy
```

once deployed the subgraph can be queried via the graphiql interface.
