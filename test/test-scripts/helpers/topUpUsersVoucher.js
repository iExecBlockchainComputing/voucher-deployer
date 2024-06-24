import { Contract, ZeroAddress } from "ethers";
import {
  VOUCHER_HUB_ADDRESS,
  provider,
  setBalance,
  getVoucherManagerWallet,
} from "./utils.js";
import { voucherHubAbi } from "../abis/VoucherHub.js";

export const topUpUsersVoucher = async ({ ownerAddress, value = 1000 }) => {
  if (!ownerAddress) {
    throw Error("missing ownerAddress");
  }

  console.log(`Topping-up ${value} on user ${ownerAddress} voucher`);

  const voucherHubContract = new Contract(
    VOUCHER_HUB_ADDRESS,
    voucherHubAbi,
    provider
  );

  const voucherAddress = await voucherHubContract.getVoucher(ownerAddress);

  if (voucherAddress === ZeroAddress) {
    throw Error(`${ownerAddress} has no voucher, cannot top-up`);
  }

  const weiValue = BigInt(value) * 10n ** 9n;
  const voucherManagerWallet = await getVoucherManagerWallet();
  await setBalance(voucherManagerWallet.address, weiValue);

  const pocoAddress = await voucherHubContract.getIexecPoco();
  const pocoContract = new Contract(
    pocoAddress,
    [
      {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "depositFor",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "payable",
        type: "function",
      },
    ],
    provider
  );

  const depositForTx = await pocoContract
    .connect(voucherManagerWallet)
    .depositFor(VOUCHER_HUB_ADDRESS, { value: weiValue, gasPrice: 0 });
  await depositForTx.wait();

  const topUpTx = await voucherHubContract
    .connect(voucherManagerWallet)
    .topUpVoucher(voucherAddress, value, { gasPrice: 0 });
  await topUpTx.wait();
  console.log(
    `Voucher ${voucherAddress} (owned by ${ownerAddress}) topped-up for ${value} (tx: ${topUpTx.hash})`
  );
};
