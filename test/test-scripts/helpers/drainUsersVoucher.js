import { Contract, ZeroAddress } from "ethers";
import {
  VOUCHER_HUB_ADDRESS,
  provider,
  getVoucherManagerWallet,
} from "./utils.js";
import { voucherHubAbi } from "../abis/VoucherHub.js";

export const drainUsersVoucher = async ({ ownerAddress}) => {
  if (!ownerAddress) {
    throw Error("missing ownerAddress");
  }

  console.log(`Draining user ${ownerAddress} voucher`);

  const voucherHubContract = new Contract(
    VOUCHER_HUB_ADDRESS,
    voucherHubAbi,
    provider
  );

  const voucherAddress = await voucherHubContract.getVoucher(ownerAddress);

  if (voucherAddress === ZeroAddress) {
    throw Error(`${ownerAddress} has no voucher, cannot top-up`);
  }

  const voucherManagerWallet = await getVoucherManagerWallet();

  const drainTx = await voucherHubContract
    .connect(voucherManagerWallet)
    .drainVoucher(voucherAddress, { gasPrice: 0 });
  await drainTx.wait();
  console.log(
    `Voucher ${voucherAddress} (owned by ${ownerAddress}) drained (tx: ${drainTx.hash})`
  );
};
