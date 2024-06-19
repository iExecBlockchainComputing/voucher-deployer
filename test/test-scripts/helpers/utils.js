import {
  Contract,
  JsonRpcProvider,
  JsonRpcSigner,
  keccak256,
  formatEther,
  toBeHex,
  Wallet,
} from "ethers";
import { readFileSync } from "fs";

import { IExec, utils } from "iexec";
import { getSignerFromPrivateKey } from "iexec/utils";
import { voucherHubAbi } from "../abis/VoucherHub.js";

export const RPC_URL = "http://localhost:8545";

export const VOUCHER_HUB_ADDRESS = readFileSync(
  "../out/VoucherHub.address",
  "utf8"
);

export const provider = new JsonRpcProvider(RPC_URL);

const VOUCHER_MANAGER = new Wallet(
  "0x2c906d4022cace2b3ee6c8b596564c26c4dcadddf1e949b769bcb0ad75c40c33",
  provider
);

const WORKERPOOL_OWNER = new Wallet(
  "0x747dbd9f33967082fbb4851c8de727ec0b74ca26561543b3c2e72e7b895e5cbd",
  provider
);

const APP_OWNER = new Wallet(
  "0x18d3e8690f7806a21669a0499c11aa3dd1f699577401e2aa027001300a8c4eec",
  provider
);

const DATASET_OWNER = new Wallet(
  "0x88a05145b95571eecc5f77d467af6b42f9b45acee6ba95731cd3de7aff602c9a",
  provider
);

export const setBalance = async (address, weiAmount) => {
  console.log(`Setting ${address} balance to ${formatEther(weiAmount)} RLC`);
  fetch(RPC_URL, {
    method: "POST",
    body: JSON.stringify({
      method: "anvil_setBalance",
      params: [address, toBeHex(weiAmount)],
      id: 1,
      jsonrpc: "2.0",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const balance = await provider.getBalance(address);
  console.log(`${address} wallet balance is now ${formatEther(balance)} RLC`);
};

export const impersonate = async (address) => {
  await fetch(RPC_URL, {
    method: "POST",
    body: JSON.stringify({
      method: "anvil_impersonateAccount",
      params: [address],
      id: 1,
      jsonrpc: "2.0",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(`Impersonating ${address}`);
};

export const stopImpersonate = async (address) => {
  await fetch(RPC_URL, {
    method: "POST",
    body: JSON.stringify({
      method: "anvil_stopImpersonatingAccount",
      params: [address],
      id: 1,
      jsonrpc: "2.0",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(`Stop impersonating ${address}`);
};

const getVoucherManagementRoles = async (targetManager) => {
  const voucherHubContract = new Contract(
    VOUCHER_HUB_ADDRESS,
    voucherHubAbi,
    provider
  );

  const MINTER_ROLE = keccak256(Buffer.from("MINTER_ROLE"));

  const MANAGER_ROLE = keccak256(Buffer.from("MANAGER_ROLE"));

  let isAssetEligibilityManager = await voucherHubContract.hasRole(
    MANAGER_ROLE,
    targetManager
  );
  let isVoucherManager = await voucherHubContract.hasRole(
    MINTER_ROLE,
    targetManager
  );

  if (!isAssetEligibilityManager || !isVoucherManager) {
    console.log(`Adding voucher administration roles to ${targetManager}`);

    const defaultAdmin = await voucherHubContract.defaultAdmin();

    console.log(`VoucherHub defaultAdmin is ${defaultAdmin}`);

    await impersonate(defaultAdmin);

    if (!isVoucherManager) {
      console.log(`Adding MINTER_ROLE to ${targetManager}`);
      await voucherHubContract
        .connect(new JsonRpcSigner(provider, defaultAdmin))
        .grantRole(MINTER_ROLE, targetManager, { gasPrice: 0 })
        .then((tx) => tx.wait());
      isVoucherManager = await voucherHubContract.hasRole(
        MINTER_ROLE,
        targetManager
      );
    }

    if (!isAssetEligibilityManager) {
      console.log(`Adding MANAGER_ROLE to ${targetManager}`);
      await voucherHubContract
        .connect(new JsonRpcSigner(provider, defaultAdmin))
        .grantRole(MANAGER_ROLE, targetManager, {
          gasPrice: 0,
        })
        .then((tx) => tx.wait());
      isAssetEligibilityManager = await voucherHubContract.hasRole(
        MANAGER_ROLE,
        targetManager
      );
    }

    await stopImpersonate(defaultAdmin);
  }
  console.log(`${targetManager} has role MINTER_ROLE: ${isVoucherManager}`);
  console.log(
    `${targetManager} has role MANAGER_ROLE: ${isAssetEligibilityManager}`
  );
};

export const getVoucherManagerWallet = async () => {
  await getVoucherManagementRoles(VOUCHER_MANAGER.address);
  return VOUCHER_MANAGER;
};

export const getWorkerpoolAddressAndOwnerWallet = async () => {
  const ownerWallet = WORKERPOOL_OWNER;
  const iexec = new IExec({
    ethProvider: getSignerFromPrivateKey(RPC_URL, ownerWallet.privateKey),
  });
  const count = await iexec.workerpool.countUserWorkerpools(
    ownerWallet.address
  );
  if (count.lt(new utils.BN(1))) {
    console.log("Deploying a new workerpool");
    const { txHash, address } = await iexec.workerpool.deployWorkerpool({
      owner: ownerWallet.address,
      description: "test pool",
    });
    console.log(`Deployed workerpool ${address} (tx: ${txHash})`);
  }
  const { objAddress } = await iexec.workerpool.showUserWorkerpool(
    0,
    ownerWallet.address
  );
  console.log(`Workerpool ${objAddress} deployed by ${ownerWallet.address}`);
  return {
    address: objAddress,
    ownerWallet: ownerWallet,
    iexec,
  };
};

export const getAppAddressAndOwnerWallet = async () => {
  const ownerWallet = APP_OWNER;
  const iexec = new IExec({
    ethProvider: getSignerFromPrivateKey(RPC_URL, ownerWallet.privateKey),
  });
  const count = await iexec.app.countUserApps(ownerWallet.address);
  if (count.lt(new utils.BN(1))) {
    console.log("Deploying a new app");
    const { txHash, address } = await iexec.app.deployApp({
      owner: ownerWallet.address,
      name: "test app",
      type: "DOCKER",
      multiaddr: "registry.hub.docker.com/iexechub/vanityeth:1.1.1",
      checksum:
        "0x00f51494d7a42a3c1c43464d9f09e06b2a99968e3b978f6cd11ab3410b7bcd14",
    });
    console.log(`Deployed app ${address} (tx: ${txHash})`);
  }
  const { objAddress } = await iexec.app.showUserApp(0, ownerWallet.address);
  console.log(`App ${objAddress} deployed by ${ownerWallet.address}`);
  return {
    address: objAddress,
    ownerWallet: ownerWallet,
    iexec,
  };
};

export const getDatasetAddressAndOwnerWallet = async () => {
  const ownerWallet = DATASET_OWNER;
  const iexec = new IExec({
    ethProvider: getSignerFromPrivateKey(RPC_URL, ownerWallet.privateKey),
  });
  const count = await iexec.dataset.countUserDatasets(ownerWallet.address);
  if (count.lt(new utils.BN(1))) {
    console.log("Deploying a new dataset");
    const { txHash, address } = await iexec.dataset.deployDataset({
      owner: ownerWallet.address,
      name: "test dataset",
      multiaddr: "/ipfs/Qmd286K6pohQcTKYqnS1YhWrCiS4gz7Xi34sdwMe9USZ7u",
      checksum:
        "0x84a3f860d54f3f5f65e91df081c8d776e8bcfb5fbc234afce2f0d7e9d26e160d",
    });
    console.log(`Deployed dataset ${address} (tx: ${txHash})`);
  }
  const { objAddress } = await iexec.dataset.showUserDataset(
    0,
    ownerWallet.address
  );
  console.log(`Dataset ${objAddress} deployed by ${ownerWallet.address}`);
  return {
    address: objAddress,
    ownerWallet: ownerWallet,
    iexec,
  };
};
