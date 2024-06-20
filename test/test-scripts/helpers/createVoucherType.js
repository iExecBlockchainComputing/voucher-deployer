import { Contract } from "ethers";
import {
  VOUCHER_HUB_ADDRESS,
  provider,
  getVoucherManagerWallet,
} from "./utils.js";
import { voucherHubAbi } from "../abis/VoucherHub.js";

export const createVoucherType = async ({
  description = "test voucher",
  duration = 1000,
}) => {
  console.log(`Creating voucherType ${description} with duration ${duration}`);
  const voucherManagerWallet = await getVoucherManagerWallet();
  const voucherHubContract = new Contract(
    VOUCHER_HUB_ADDRESS,
    voucherHubAbi,
    provider
  );
  const tx = await voucherHubContract
    .connect(voucherManagerWallet)
    .createVoucherType(description, duration);
  await tx.wait();
  console.log(
    `voucherType ${description} created, duration ${duration} (tx: ${tx.hash})`
  );
};
