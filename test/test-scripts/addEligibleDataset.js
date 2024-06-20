import { addEligibleAsset } from "./helpers/addEligibleAsset.js";
import { getDatasetAddressAndOwnerWallet } from "./helpers/utils.js";

const main = async () => {
  const { VOUCHER_TYPE_ID } = process.env;
  const { address } = await getDatasetAddressAndOwnerWallet();
  await addEligibleAsset({
    assetAddress: address,
    voucherType: VOUCHER_TYPE_ID,
  });
};

main();
