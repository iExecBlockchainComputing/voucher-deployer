import { Contract } from "ethers";
import {
  VOUCHER_HUB_ADDRESS,
  provider,
  getVoucherManagerWallet,
} from "./utils.js";
import { voucherHubAbi } from "../abis/VoucherHub.js";

export const removeEligibleAsset = async ({
  assetAddress,
  voucherType = 0,
}) => {
  if (!assetAddress) {
    throw Error("missing assetAddress");
  }
  console.log(
    `Removing ${assetAddress} from voucherType ${voucherType} eligible assets`
  );
  const voucherManagerWallet = await getVoucherManagerWallet();
  const voucherHubContract = new Contract(
    VOUCHER_HUB_ADDRESS,
    voucherHubAbi,
    provider
  );
  const tx = await voucherHubContract
    .connect(voucherManagerWallet)
    .removeEligibleAsset(0, assetAddress);
  await tx.wait();
  console.log(
    `Asset ${assetAddress} removed from eligibleAssets for voucherType ${voucherType} (tx: ${tx.hash})`
  );
};
