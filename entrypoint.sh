# create output dir if needed
mkdir /app/out

# deploy voucher
echo -e "\n#####################################\n# deploying iexec-voucher-contracts #\n#####################################\n"

cd /app/iexec-voucher-contracts
git log -1 > /app/out/iexec-voucher-contracts.git-log
npx hardhat run deploy/deploy.ts --network bellecour-fork

cp /app/iexec-voucher-contracts/VoucherHub.address /app/out/
cp /app/iexec-voucher-contracts/VoucherHub.block /app/out/

cp -r /app/iexec-voucher-contracts/abis/ /app/out/

# upgrade poco
echo -e "\n##########################\n# deploying PoCo upgrade #\n##########################\n"

cd /app/PoCo
git log -1 > /app/out/PoCo.git-log
npx hardhat run scripts/upgrade.ts --network bellecour-fork

# deploy subgraph
echo -e "\n##############################################\n# deploying iexec-voucher-contracts subgraph #\n##############################################\n"

cd /app/voucher-subgraph
export VOUCHER_HUB_ADDRESS=$(cat /app/out/VoucherHub.address)
export VOUCHER_HUB_START_BLOCK=$(cat /app/out/VoucherHub.block)
npm run codegen
npm run create
npm run deploy