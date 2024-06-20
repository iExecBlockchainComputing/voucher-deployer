import { addEligibleAsset } from "./helpers/addEligibleAsset.js";
import { getAppAddressAndOwnerWallet } from "./helpers/utils.js";

const main = async () => {
  const { VOUCHER_TYPE_ID } = process.env;
  const { address } = await getAppAddressAndOwnerWallet();
  await addEligibleAsset({
    assetAddress: address,
    voucherType: VOUCHER_TYPE_ID,
  });
};

main();
