git clone git@github.com:iExecBlockchainComputing/iexec-voucher-contracts.git
cd iexec-voucher-contracts
git checkout develop
# build artifacts
npm ci
npm run build
# extract abis
cat artifacts/contracts/VoucherHub.sol/VoucherHub.json | jq .abi > ../abis/VoucherHub.json
cat artifacts/contracts/beacon/Voucher.sol/Voucher.json | jq .abi > ../abis/Voucher.json