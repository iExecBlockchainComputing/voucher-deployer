import { removeEligibleAsset } from "./helpers/removeEligibleAsset.js";

const main = async () => {
  const ASSET_ADDRESS = process.env.ASSET_ADDRESS;
  const VOUCHER_TYPE_ID = process.env.VOUCHER_TYPE_ID;
  removeEligibleAsset({
    assetAddress: ASSET_ADDRESS,
    voucherType: VOUCHER_TYPE_ID,
  });
};

main();
