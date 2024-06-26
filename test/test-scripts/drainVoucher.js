import { drainUsersVoucher } from "./helpers/drainUsersVoucher.js";

const main = async () => {
  const OWNER_ADDRESS = process.env.OWNER_ADDRESS;

  await drainUsersVoucher({
    ownerAddress: OWNER_ADDRESS,
  });
};

main();
