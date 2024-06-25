import { Contract, Wallet, ZeroAddress } from "ethers";
import {
  VOUCHER_HUB_ADDRESS,
  provider,
  setBalance,
  getVoucherManagerWallet,
} from "./utils.js";
import { voucherHubAbi } from "../abis/VoucherHub.js";

export const createVoucher = async ({
  ownerAddress = Wallet.createRandom().address,
  voucherType = 0,
  value = 1000,
}) => {
  console.log(
    `Creating voucher type ${voucherType} for ${ownerAddress} with value ${value}`
  );

  const voucherHubContract = new Contract(
    VOUCHER_HUB_ADDRESS,
    voucherHubAbi,
    provider
  );

  const existingVoucherAddress = await voucherHubContract.getVoucher(
    ownerAddress
  );

  if (existingVoucherAddress !== ZeroAddress) {
    console.log(
      `${ownerAddress} already owns the voucher ${existingVoucherAddress}, skipping creation`
    );
    return;
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

  const createTx = await voucherHubContract
    .connect(voucherManagerWallet)
    .createVoucher(ownerAddress, voucherType, value, { gasPrice: 0 });
  await createTx.wait();
  console.log(
    `Voucher type ${voucherType} created for ${ownerAddress.toLowerCase()} with value ${value} (tx: ${
      createTx.hash
    })`
  );
};
