import { createVoucher } from "./helpers/createVoucher.js";

const main = async () => {
  const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
  const VOUCHER_TYPE_ID = process.env.VOUCHER_TYPE_ID;
  const VALUE = process.env.VALUE;

  await createVoucher({
    ownerAddress: OWNER_ADDRESS,
    voucherType: VOUCHER_TYPE_ID,
    value: VALUE,
  });
};

main();
