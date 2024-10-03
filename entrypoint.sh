# create output dir if needed
mkdir /app/out

# deploy voucher
echo -e "\n#####################################\n# deploying iexec-voucher-contracts #\n#####################################\n"

cd /app/iexec-voucher-contracts
cat .git-log
cp .git-log /app/out/iexec-voucher-contracts.git-log
npx hardhat run deploy/deploy.ts --network bellecour-fork || exit 1

cp /app/iexec-voucher-contracts/VoucherHub.address /app/out/
cp /app/iexec-voucher-contracts/VoucherHub.block /app/out/

cp -r /app/iexec-voucher-contracts/abis/ /app/out/

# upgrade poco
echo -e "\n##########################\n# deploying PoCo upgrade #\n##########################\n"
if [ "$FORCE_POCO_UPGRADE" == "true" ]
then
    cd /app/PoCo
    cat .git-log
    cp .git-log /app/out/PoCo.git-log
    npx hardhat run scripts/upgrade.ts --network bellecour-fork || exit 1
else
    echo -e "FORCE_POCO_UPGRADE != true\n  => skiping PoCo upgrade deployment"
fi

# deploy subgraph
echo -e "\n##############################################\n# deploying iexec-voucher-contracts subgraph #\n##############################################\n"
if [ "$SKIP_SUBGRAPH" == "true" ]
then
    echo -e "SKIP_SUBGRAPH == true\n  => skiping subgraph deployment"
else
    cd /app/voucher-subgraph
    export VOUCHER_HUB_ADDRESS=$(cat /app/out/VoucherHub.address)
    export VOUCHER_HUB_START_BLOCK=$(cat /app/out/VoucherHub.block)
    npm run codegen || exit 1
    npm run create || exit 1
    npm run deploy || exit 1
fi
