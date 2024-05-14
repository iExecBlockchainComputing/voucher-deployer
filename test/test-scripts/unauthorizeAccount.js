import { Contract, JsonRpcSigner } from "ethers";
import { provider, impersonate, stopImpersonate } from "./utils.js";

const unauthorizeAccount = async () => {
  const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS;
  const VOUCHER_ADDRESS = process.env.VOUCHER_ADDRESS;

  if (!VOUCHER_ADDRESS) {
    throw Error("missing env VOUCHER_ADDRESS");
  }
  if (!ACCOUNT_ADDRESS) {
    throw Error("missing env ACCOUNT_ADDRESS");
  }

  const voucherContract = new Contract(
    VOUCHER_ADDRESS,
    [
      {
        inputs: [],
        name: "owner",
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
            name: "account",
            type: "address",
          },
        ],
        name: "unauthorizeAccount",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    provider
  );
  const owner = await voucherContract.owner();

  await impersonate(owner);

  const tx = await voucherContract
    .connect(new JsonRpcSigner(provider, owner))
    .unauthorizeAccount(ACCOUNT_ADDRESS, { gasPrice: 0 });
  await tx.wait();

  await stopImpersonate(owner);

  console.log(
    `account ${ACCOUNT_ADDRESS} removed from authorizedAccounts for voucher ${VOUCHER_ADDRESS} (tx: ${tx.hash})`
  );
};

unauthorizeAccount();
