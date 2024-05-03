FROM node:18.19

WORKDIR /app

RUN git clone https://github.com/iExecBlockchainComputing/iexec-voucher-contracts.git
RUN git clone https://github.com/iExecBlockchainComputing/PoCo.git

######
# prepare iexec-voucher-contracts deployer
######

WORKDIR /app/iexec-voucher-contracts

RUN git checkout develop
RUN npm ci
RUN npm run build

# patch repo
COPY iexec-voucher-contracts-patch/ iexec-voucher-contracts-patch/
RUN cat iexec-voucher-contracts-patch/hardhat.config-append.ts >> hardhat.config.ts
RUN cat iexec-voucher-contracts-patch/deploy.ts > deploy/deploy.ts

######
# prepare PoCo upgrade deployer
######

WORKDIR /app/PoCo

RUN git checkout develop
RUN npm ci
RUN npm run build

# patch repo
COPY PoCo-patch/ PoCo-patch/
RUN cat PoCo-patch/hardhat.config-append.ts >> hardhat.config.ts
RUN cat PoCo-patch/upgrade.ts > scripts/upgrade.ts

WORKDIR /app

COPY entrypoint.sh entrypoint.sh

ENTRYPOINT [ "bash", "entrypoint.sh" ]