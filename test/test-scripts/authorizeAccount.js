import { authorizeAccount } from "./helpers/authorizeAccount.js";

const main = async () => {
  const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS;
  const VOUCHER_ADDRESS = process.env.VOUCHER_ADDRESS;
  await authorizeAccount({
    accountAddress: ACCOUNT_ADDRESS,
    voucherAddress: VOUCHER_ADDRESS,
  });
};

main();
