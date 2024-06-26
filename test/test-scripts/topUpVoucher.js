import { topUpUsersVoucher } from "./helpers/topUpUsersVoucher.js";

const main = async () => {
  const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
  const VALUE = process.env.VALUE;

  await topUpUsersVoucher({
    ownerAddress: OWNER_ADDRESS,
    value: VALUE,
  });
};

main();
