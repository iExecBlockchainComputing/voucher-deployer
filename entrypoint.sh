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