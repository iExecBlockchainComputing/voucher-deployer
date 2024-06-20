import { createVoucherType } from "./helpers/createVoucherType.js";

const main = async () => {
  const DESCRIPTION = process.env.DESCRIPTION;
  const DURATION = process.env.DURATION;
  await createVoucherType({
    description: DESCRIPTION,
    duration: DURATION,
  });
};

main();
