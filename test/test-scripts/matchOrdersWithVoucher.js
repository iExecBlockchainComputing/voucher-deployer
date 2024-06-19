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
  const { VOUCHER_TYPE_ID, VOUCHER_VALUE } = process.env;

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
        })
        .then(iexecWorkerpoolOwner.order.signWorkerpoolorder),
      iexecAppOwner.order
        .createApporder({
          app: appAddress,
        })
        .then(iexecAppOwner.order.signApporder),
      iexecDatasetOwner.order
        .createDatasetorder({
          dataset: datasetAddress,
        })
        .then(iexecDatasetOwner.order.signDatasetorder),
      iexecRequester.order
        .createRequestorder({
          app: appAddress,
          dataset: datasetAddress,
          workerpool: workerpoolAddress,
          category: 0,
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
