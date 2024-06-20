import { Wallet } from "ethers";
import { IExec } from "iexec";
import { getSignerFromPrivateKey } from "iexec/utils";
import {
  RPC_URL,
  VOUCHER_HUB_ADDRESS,
  getAppAddressAndOwnerWallet,
  getDatasetAddressAndOwnerWallet,
  getWorkerpoolAddressAndOwnerWallet,
} from "./helpers/utils.js";
import { createVoucher } from "./helpers/createVoucher.js";

const main = async () => {
  const {
    VOUCHER_TYPE_ID,
    VOUCHER_VALUE,
    APP_PRICE,
    DATASET_PRICE,
    WORKERPOOL_PRICE,
  } = process.env;

  const { iexec: iexecWorkerpoolOwner, address: workerpoolAddress } =
    await getWorkerpoolAddressAndOwnerWallet();

  const { iexec: iexecAppOwner, address: appAddress } =
    await getAppAddressAndOwnerWallet();

  const { iexec: iexecDatasetOwner, address: datasetAddress } =
    await getDatasetAddressAndOwnerWallet();

  const requesterWallet = Wallet.createRandom();
  const iexecRequester = new IExec(
    {
      ethProvider: getSignerFromPrivateKey(RPC_URL, requesterWallet.privateKey),
    },
    { voucherHubAddress: VOUCHER_HUB_ADDRESS }
  );

  await createVoucher({
    ownerAddress: requesterWallet.address,
    voucherType: VOUCHER_TYPE_ID,
    value: VOUCHER_VALUE,
  });

  const [workerpoolorder, apporder, datasetorder, requestorder] =
    await Promise.all([
      iexecWorkerpoolOwner.order
        .createWorkerpoolorder({
          workerpool: workerpoolAddress,
          category: 0,
          workerpoolprice: WORKERPOOL_PRICE,
        })
        .then(iexecWorkerpoolOwner.order.signWorkerpoolorder),
      iexecAppOwner.order
        .createApporder({
          app: appAddress,
          appprice: APP_PRICE,
        })
        .then(iexecAppOwner.order.signApporder),
      iexecDatasetOwner.order
        .createDatasetorder({
          dataset: datasetAddress,
          datasetprice: DATASET_PRICE,
        })
        .then(iexecDatasetOwner.order.signDatasetorder),
      iexecRequester.order
        .createRequestorder({
          app: appAddress,
          dataset: datasetAddress,
          workerpool: workerpoolAddress,
          category: 0,
          appmaxprice: APP_PRICE,
          datasetmaxprice: DATASET_PRICE,
          workerpoolmaxprice: WORKERPOOL_PRICE,
        })
        .then(iexecRequester.order.signRequestorder),
    ]);

  const { dealid } = await iexecRequester.order.matchOrders(
    {
      apporder,
      datasetorder,
      workerpoolorder,
      requestorder,
    },
    { useVoucher: true }
  );
  console.log(`deal created ${dealid}`);
};

main();
