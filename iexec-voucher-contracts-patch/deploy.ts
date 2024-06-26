import { writeFile } from "fs/promises";
import { ethers } from "hardhat";
import * as voucherHubUtils from "../scripts/voucherHubUtils";
import * as voucherUtils from "../scripts/voucherUtils";

async function main() {
  const iexecPoco = "0x3eca1B216A7DF1C7689aEb259fFB83ADFB894E7f";
  const [admin] = await ethers.getSigners();

  const beacon = await voucherUtils.deployBeaconAndImplementation(
    admin.address
  );
  const beaconAddress = await beacon.getAddress();
  console.log(`UpgradeableBeacon: ${beaconAddress}`);
  console.log(`Voucher implementation: ${await beacon.implementation()}`);

  const voucherHub = await voucherHubUtils.deployHub(
    admin.address, // proxy admin
    admin.address, // voucher manager
    admin.address, // voucher minter
    iexecPoco,
    beaconAddress
  );

  const voucherHubAddress = await voucherHub.getAddress();
  const deployTx = voucherHub.deploymentTransaction();
  const deployTxReceipt = await deployTx.wait();
  const deployBlock = deployTxReceipt.blockNumber;

  console.log(
    `VoucherHub: ${voucherHubAddress} (tx: ${deployTx.hash}, block: ${deployBlock})`
  );

  await writeFile("VoucherHub.address", voucherHubAddress);
  await writeFile("VoucherHub.block", `${deployBlock}`);
}

main();
