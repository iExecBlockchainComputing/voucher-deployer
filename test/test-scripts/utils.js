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

const RPC_URL = "http://localhost:8545";

export const VOUCHER_HUB_ADDRESS = readFileSync(
  "../out/VoucherHub.address",
  "utf8"
);

console.log(`using VoucherHub at ${VOUCHER_HUB_ADDRESS}`);

export const provider = new JsonRpcProvider(RPC_URL);

const VOUCHER_MANAGER = new Wallet(
  "0x2c906d4022cace2b3ee6c8b596564c26c4dcadddf1e949b769bcb0ad75c40c33",
  provider
);

export const setBalance = async (address, weiAmount) => {
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
  console.log(`impersonating ${address}`);
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
  console.log(`stop impersonating ${address}`);
};

const getVoucherManagementRoles = async (targetManager) => {
  const voucherHubContract = new Contract(
    VOUCHER_HUB_ADDRESS,
    [
      {
        inputs: [],
        name: "defaultAdmin",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "grantRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "hasRole",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    provider
  );

  const VOUCHER_MANAGER_ROLE = keccak256(Buffer.from("VOUCHER_MANAGER_ROLE"));

  const ASSET_ELIGIBILITY_MANAGER_ROLE = keccak256(
    Buffer.from("ASSET_ELIGIBILITY_MANAGER_ROLE")
  );

  const isAlreadyAssetEligibilityManager = await voucherHubContract.hasRole(
    ASSET_ELIGIBILITY_MANAGER_ROLE,
    targetManager
  );
  const isAlreadyVoucherManager = await voucherHubContract.hasRole(
    VOUCHER_MANAGER_ROLE,
    targetManager
  );

  if (isAlreadyAssetEligibilityManager && isAlreadyVoucherManager) {
    return;
  }

  const defaultAdmin = await voucherHubContract.defaultAdmin();

  console.log("VoucherHub defaultAdmin:", defaultAdmin);

  await impersonate(defaultAdmin);

  await voucherHubContract
    .connect(new JsonRpcSigner(provider, defaultAdmin))
    .grantRole(VOUCHER_MANAGER_ROLE, targetManager, { gasPrice: 0 })
    .then((tx) => tx.wait());

  await voucherHubContract
    .connect(new JsonRpcSigner(provider, defaultAdmin))
    .grantRole(ASSET_ELIGIBILITY_MANAGER_ROLE, targetManager, {
      gasPrice: 0,
    })
    .then((tx) => tx.wait());

  await stopImpersonate(defaultAdmin);

  console.log(
    `${targetManager} has role VOUCHER_MANAGER_ROLE: ${await voucherHubContract.hasRole(
      VOUCHER_MANAGER_ROLE,
      targetManager
    )}`
  );

  console.log(
    `${targetManager} has role ASSET_ELIGIBILITY_MANAGER_ROLE: ${await voucherHubContract.hasRole(
      ASSET_ELIGIBILITY_MANAGER_ROLE,
      targetManager
    )}`
  );
};

export const getVoucherManagerWallet = async () => {
  await getVoucherManagementRoles(VOUCHER_MANAGER.address);
  return VOUCHER_MANAGER;
};
