import { Contract, JsonRpcSigner, Wallet } from "ethers";
import { provider, impersonate, stopImpersonate } from "./utils.js";
import { voucherAbi } from "../abis/Voucher.js";

export const authorizeAccount = async ({
  accountAddress = Wallet.createRandom().address,
  voucherAddress,
}) => {
  if (!voucherAddress) {
    throw Error("missing voucherAddress");
  }
  console.log(
    `Adding ${accountAddress} as authorized account for voucher ${voucherAddress}`
  );

  const voucherContract = new Contract(voucherAddress, voucherAbi, provider);
  const owner = await voucherContract.owner();

  await impersonate(owner);

  const tx = await voucherContract
    .connect(new JsonRpcSigner(provider, owner))
    .authorizeAccount(accountAddress, { gasPrice: 0 });
  await tx.wait();

  await stopImpersonate(owner);

  console.log(
    `Account ${accountAddress} added to authorizedAccounts for voucher ${voucherAddress} (tx: ${tx.hash})`
  );
};
