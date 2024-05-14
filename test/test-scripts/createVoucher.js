import { Contract, Wallet } from "ethers";
import {
  VOUCHER_HUB_ADDRESS,
  provider,
  setBalance,
  getVoucherManagerWallet,
} from "./utils.js";

const createVoucher = async () => {
  const OWNER_ADDRESS =
    process.env.OWNER_ADDRESS || Wallet.createRandom().address;
  const VOUCHER_TYPE_ID = process.env.VOUCHER_TYPE_ID || "0";
  const VALUE = process.env.VALUE || "1000";

  const weiValue = BigInt(VALUE) * 10n ** 9n;
  const voucherManagerWallet = await getVoucherManagerWallet();
  await setBalance(voucherManagerWallet.address, weiValue);
  const voucherHubContract = new Contract(
    VOUCHER_HUB_ADDRESS,
    [
      {
        inputs: [],
        name: "getIexecPoco",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "voucherType",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "createVoucher",
        outputs: [
          {
            internalType: "address",
            name: "voucherAddress",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    provider
  );

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
    .createVoucher(OWNER_ADDRESS, VOUCHER_TYPE_ID, VALUE, { gasPrice: 0 });
  await createTx.wait();
  console.log(
    `Voucher type ${VOUCHER_TYPE_ID} created for ${OWNER_ADDRESS.toLowerCase()} with value ${VALUE} (tx: ${
      createTx.hash
    })`
  );
};

createVoucher();
