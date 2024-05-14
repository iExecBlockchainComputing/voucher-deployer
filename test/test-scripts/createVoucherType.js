import { Contract } from "ethers";
import {
  VOUCHER_HUB_ADDRESS,
  provider,
  getVoucherManagerWallet,
} from "./utils.js";

const createVoucherType = async () => {
  const DESCRIPTION = process.env.DESCRIPTION || "test voucher";
  const DURATION = process.env.DURATION || "1000";

  const voucherManagerWallet = await getVoucherManagerWallet();
  const voucherHubContract = new Contract(
    VOUCHER_HUB_ADDRESS,
    [
      {
        inputs: [
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "duration",
            type: "uint256",
          },
        ],
        name: "createVoucherType",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    provider
  );
  const tx = await voucherHubContract
    .connect(voucherManagerWallet)
    .createVoucherType(DESCRIPTION, DURATION);
  await tx.wait();
  console.log(
    `voucherType ${DESCRIPTION} created, duration ${DURATION} (tx: ${tx.hash})`
  );
};

createVoucherType();
