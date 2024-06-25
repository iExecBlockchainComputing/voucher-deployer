FROM node:18.20-alpine

# install deps
RUN apk --no-cache add git jq

WORKDIR /app

RUN git clone https://github.com/iExecBlockchainComputing/iexec-voucher-contracts.git
RUN git clone https://github.com/iExecBlockchainComputing/PoCo.git
COPY voucher-subgraph voucher-subgraph

######
# prepare iexec-voucher-contracts deployer
######

WORKDIR /app/iexec-voucher-contracts

RUN git checkout develop
RUN git pull
RUN git log -1 > .git-log
RUN rm -rf .git
RUN npm ci
RUN npm run build

# patch repo
COPY iexec-voucher-contracts-patch/ iexec-voucher-contracts-patch/
RUN cat iexec-voucher-contracts-patch/hardhat.config-append.ts >> hardhat.config.ts
RUN cat iexec-voucher-contracts-patch/deploy.ts > deploy/deploy.ts

# extract abis
RUN mkdir abis
RUN cat artifacts/contracts/VoucherHub.sol/VoucherHub.json | jq .abi > ./abis/VoucherHub.json
RUN cat artifacts/contracts/beacon/Voucher.sol/Voucher.json | jq .abi > ./abis/Voucher.json

######
# prepare PoCo upgrade deployer
######

WORKDIR /app/PoCo

RUN git checkout develop
RUN git pull
RUN git log -1 > .git-log
RUN rm -rf .git
RUN npm ci
RUN npm run build

# patch repo
COPY PoCo-patch/ PoCo-patch/
RUN cat PoCo-patch/hardhat.config-append.ts >> hardhat.config.ts
RUN cat PoCo-patch/upgrade.ts > scripts/upgrade.ts

######
# prepare voucher-subgraph deployer
######

WORKDIR /app/voucher-subgraph

# update abis
RUN cp -r /app/iexec-voucher-contracts/abis/ ./abis/
RUN npm ci
RUN npm run codegen

WORKDIR /app

# cleanup unnecessary deps
RUN apk del jq

COPY entrypoint.sh entrypoint.sh

ENTRYPOINT [ "sh", "entrypoint.sh" ]