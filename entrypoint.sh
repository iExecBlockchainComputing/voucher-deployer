# create output dir if needed
mkdir /app/out

# deploy voucher
cd /app/iexec-voucher-contracts
git log -1 > /app/out/iexec-voucher-contracts.git-log
npx hardhat run deploy/deploy.ts --network bellecour-fork

cp /app/iexec-voucher-contracts/VoucherHub.address /app/out/
cp /app/iexec-voucher-contracts/VoucherHub.block /app/out/

# upgrade poco
cd /app/PoCo
git log -1 > /app/out/PoCo.git-log
npx hardhat run scripts/upgrade.ts --network bellecour-fork

# deploy subgraph
cd /app/voucher-subgraph
cat subgraph.template.yaml \
  | sed "s|#VOUCHER_HUB_ADDRESS#|address: \"$(cat /app/out/VoucherHub.address)\"|g" \
  | sed "s|#VOUCHER_HUB_START_BLOCK#|startBlock: $(cat /app/out/VoucherHub.block)|g" \
  > subgraph.yaml
npm run create
npm run deploy