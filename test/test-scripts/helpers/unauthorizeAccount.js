import { Contract, JsonRpcSigner } from "ethers";
import { provider, impersonate, stopImpersonate } from "./utils.js";
import { voucherAbi } from "../abis/Voucher.js";

export const unauthorizeAccount = async ({
  accountAddress,
  voucherAddress,
}) => {
  if (!voucherAddress) {
    throw Error("missing voucherAddress");
  }
  if (!accountAddress) {
    throw Error("missing accountAddress");
  }
  console.log(
    `Removing ${accountAddress} from voucher ${voucherAddress} authorized accounts`
  );
  const voucherContract = new Contract(voucherAddress, voucherAbi, provider);
  const owner = await voucherContract.owner();

  await impersonate(owner);

  const tx = await voucherContract
    .connect(new JsonRpcSigner(provider, owner))
    .unauthorizeAccount(accountAddress, { gasPrice: 0 });
  await tx.wait();

  await stopImpersonate(owner);

  console.log(
    `Account ${accountAddress} removed from authorizedAccounts for voucher ${voucherAddress} (tx: ${tx.hash})`
  );
};
