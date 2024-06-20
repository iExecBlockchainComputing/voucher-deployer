git clone git@github.com:iExecBlockchainComputing/iexec-voucher-contracts.git
cd iexec-voucher-contracts
git checkout develop
git pull
# build artifacts
npm ci
npm run build
# extract abis
mkdir -p abis
cat artifacts/contracts/VoucherHub.sol/VoucherHub.json | jq .abi > abis/VoucherHub.json
cat artifacts/contracts/beacon/Voucher.sol/Voucher.json | jq .abi > abis/Voucher.json
# refresh in sub projects
cp abis/VoucherHub.json ../voucher-subgraph/abis/VoucherHub.json
cp abis/Voucher.json ../voucher-subgraph/abis/Voucher.json
echo "export const voucherHubAbi = $(cat abis/VoucherHub.json);" > ../test/test-scripts/abis/VoucherHub.js
echo "export const voucherAbi = $(cat abis/Voucher.json);" > ../test/test-scripts/abis/Voucher.js