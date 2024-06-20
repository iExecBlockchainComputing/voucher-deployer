import { Contract, Wallet } from "ethers";
import {
  VOUCHER_HUB_ADDRESS,
  provider,
  getVoucherManagerWallet,
} from "./utils.js";
import { abi } from "../abis/VoucherHub.js";

export const addEligibleAsset = async ({
  assetAddress = Wallet.createRandom().address,
  voucherType = 0,
}) => {
  console.log(
    `Adding ${assetAddress} as eligible asset to voucherType ${voucherType}`
  );
  const voucherManagerWallet = await getVoucherManagerWallet();
  const voucherHubContract = new Contract(VOUCHER_HUB_ADDRESS, abi, provider);
  const tx = await voucherHubContract
    .connect(voucherManagerWallet)
    .addEligibleAsset(voucherType, assetAddress);
  await tx.wait();
  console.log(
    `Asset ${assetAddress} added to eligibleAssets for voucherType ${voucherType} (tx: ${tx.hash})`
  );
};
