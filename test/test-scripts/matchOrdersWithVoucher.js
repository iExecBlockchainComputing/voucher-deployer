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
    NO_DATASET,
    REQUESTER_PRIVATE_KEY,
  } = process.env;

  const useDataset = !NO_DATASET;

  const { iexec: iexecWorkerpoolOwner, address: workerpoolAddress } =
    await getWorkerpoolAddressAndOwnerWallet();

  const { iexec: iexecAppOwner, address: appAddress } =
    await getAppAddressAndOwnerWallet();

  let iexecDatasetOwner;
  let datasetAddress;
  if (useDataset) {
    const res = await getDatasetAddressAndOwnerWallet();
    iexecDatasetOwner = res.iexec;
    datasetAddress = res.address;
  }

  const requesterWallet = REQUESTER_PRIVATE_KEY
    ? new Wallet(REQUESTER_PRIVATE_KEY)
    : Wallet.createRandom();

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

  const [workerpoolorder, apporder, datasetorderOrUndefined, requestorder] =
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
      useDataset
        ? iexecDatasetOwner.order
            .createDatasetorder({
              dataset: datasetAddress,
              datasetprice: DATASET_PRICE,
            })
            .then(iexecDatasetOwner.order.signDatasetorder)
        : Promise.resolve(undefined),
      iexecRequester.order
        .createRequestorder({
          app: appAddress,
          dataset: useDataset ? datasetAddress : undefined,
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
      datasetorder: datasetorderOrUndefined,
      workerpoolorder,
      requestorder,
    },
    { useVoucher: true }
  );
  console.log(`deal created ${dealid}`);
};

main();
