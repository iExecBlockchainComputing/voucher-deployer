import { Contract, Wallet } from "ethers";
import {
  VOUCHER_HUB_ADDRESS,
  provider,
  getVoucherManagerWallet,
} from "./utils.js";

const addEligibleAsset = async () => {
  const ASSET_ADDRESS =
    process.env.ASSET_ADDRESS || Wallet.createRandom().address;
  const VOUCHER_TYPE_ID = process.env.VOUCHER_TYPE_ID || "0";

  const voucherManagerWallet = await getVoucherManagerWallet();
  const voucherHubContract = new Contract(
    VOUCHER_HUB_ADDRESS,
    [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "voucherTypeId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "asset",
            type: "address",
          },
        ],
        name: "addEligibleAsset",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    provider
  );
  const tx = await voucherHubContract
    .connect(voucherManagerWallet)
    .addEligibleAsset(0, ASSET_ADDRESS);
  await tx.wait();
  console.log(
    `asset ${ASSET_ADDRESS} added to eligibleAssets for voucherType ${VOUCHER_TYPE_ID} (tx: ${tx.hash})`
  );
};

addEligibleAsset();
