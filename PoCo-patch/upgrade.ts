import hre, { ethers } from "hardhat";
import CONFIG from "../config/config.json";
import { getFunctionSignatures } from "../migrations/utils/getFunctionSignatures";
import {
  ERC1538Query__factory,
  ERC1538QueryDelegate__factory,
  ENSIntegrationDelegate__factory,
  ERC1538UpdateDelegate__factory,
  GenericFactory__factory,
  IexecAccessorsDelegate__factory,
  IexecAccessorsABILegacyDelegate__factory,
  IexecCategoryManagerDelegate__factory,
  IexecERC20Delegate__factory,
  IexecEscrowNativeDelegate__factory,
  IexecMaintenanceDelegate__factory,
  IexecMaintenanceExtraDelegate__factory,
  IexecOrderManagementDelegate__factory,
  IexecPoco1Delegate__factory,
  IexecPoco2Delegate__factory,
  IexecPocoAccessorsDelegate__factory,
  IexecRelayDelegate__factory,
  IexecPocoBoostDelegate__factory,
  IexecPocoBoostAccessorsDelegate__factory,
} from "../typechain";

const genericFactoryAddress =
  require("@amxx/factory/deployments/GenericFactory.json").address;

const rpcURL = hre.network.config?.url;
const chainId = "134";
const deploymentOptions = CONFIG.chains[chainId].v5;
const salt = deploymentOptions.salt;
const IEXEC_HUB_ADDRESS = deploymentOptions.ERC1538Proxy;

const getPocoOwnership = async (target: string) => {
  console.log(`Transferring PoCo ownership to ${target}`);
  const iexecContract = new ethers.Contract(
    IEXEC_HUB_ADDRESS,
    [
      {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
        constant: true,
      },
      {
        inputs: [
          { internalType: "address", name: "newOwner", type: "address" },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    ethers.provider
  );
  const iexecOwner = await iexecContract.owner();
  const ownerSigner = await ethers.getSigner(iexecOwner);
  await fetch(rpcURL, {
    method: "POST",
    body: JSON.stringify({
      method: "hardhat_impersonateAccount", // supported by hardhat and anvil
      params: [iexecOwner],
      id: 1,
      jsonrpc: "2.0",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const tx = await iexecContract
    .connect(ownerSigner)
    .transferOwnership(target, { gasPrice: 0 });
  await tx.wait();

  await fetch(rpcURL, {
    method: "POST",
    body: JSON.stringify({
      method: "hardhat_stopImpersonatingAccount", // supported by hardhat and anvil
      params: [iexecOwner],
      id: 1,
      jsonrpc: "2.0",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("PoCo transferred");
};

const main = async () => {
  const [owner] = await ethers.getSigners();

  await getPocoOwnership(owner.address);

  console.log("Deploying modules...");
  const modules = [
    {
      name: "ERC1538QueryDelegate",
      abi: ERC1538QueryDelegate__factory.abi,
      bytecode: ERC1538QueryDelegate__factory.bytecode,
    },
    {
      name: "IexecAccessorsDelegate",
      abi: IexecAccessorsDelegate__factory.abi,
      bytecode: IexecAccessorsDelegate__factory.bytecode,
    },
    {
      name: "IexecAccessorsABILegacyDelegate",
      abi: IexecAccessorsABILegacyDelegate__factory.abi,
      bytecode: IexecAccessorsABILegacyDelegate__factory.bytecode,
    },
    {
      name: "IexecCategoryManagerDelegate",
      abi: IexecCategoryManagerDelegate__factory.abi,
      bytecode: IexecCategoryManagerDelegate__factory.bytecode,
    },
    {
      name: "IexecERC20Delegate",
      abi: IexecERC20Delegate__factory.abi,
      bytecode: IexecERC20Delegate__factory.bytecode,
    },
    {
      name: "IexecEscrowNativeDelegate",
      abi: IexecEscrowNativeDelegate__factory.abi,
      bytecode: IexecEscrowNativeDelegate__factory.bytecode,
    },
    {
      name: "IexecMaintenanceDelegate",
      abi: IexecMaintenanceDelegate__factory.abi,
      bytecode: IexecMaintenanceDelegate__factory.linkBytecode({
        ["contracts/libs/IexecLibOrders_v5.sol:IexecLibOrders_v5"]:
          deploymentOptions.IexecLibOrders_v5,
      }),
    },
    {
      name: "IexecOrderManagementDelegate",
      abi: IexecOrderManagementDelegate__factory.abi,
      bytecode: IexecOrderManagementDelegate__factory.linkBytecode({
        ["contracts/libs/IexecLibOrders_v5.sol:IexecLibOrders_v5"]:
          deploymentOptions.IexecLibOrders_v5,
      }),
    },
    {
      name: "IexecPoco1Delegate",
      abi: IexecPoco1Delegate__factory.abi,
      bytecode: IexecPoco1Delegate__factory.linkBytecode({
        ["contracts/libs/IexecLibOrders_v5.sol:IexecLibOrders_v5"]:
          deploymentOptions.IexecLibOrders_v5,
      }),
    },
    {
      name: "IexecPoco2Delegate",
      abi: IexecPoco2Delegate__factory.abi,
      bytecode: IexecPoco2Delegate__factory.bytecode,
    },
    {
      name: "IexecRelayDelegate",
      abi: IexecRelayDelegate__factory.abi,
      bytecode: IexecRelayDelegate__factory.bytecode,
    },
    {
      name: "ENSIntegrationDelegate",
      abi: ENSIntegrationDelegate__factory.abi,
      bytecode: ENSIntegrationDelegate__factory.bytecode,
    },
    {
      name: "IexecMaintenanceExtraDelegate",
      abi: IexecMaintenanceExtraDelegate__factory.abi,
      bytecode: IexecMaintenanceExtraDelegate__factory.bytecode,
    },
    {
      name: "IexecPocoAccessorsDelegate",
      abi: IexecPocoAccessorsDelegate__factory.abi,
      bytecode: IexecPocoAccessorsDelegate__factory.linkBytecode({
        ["contracts/libs/IexecLibOrders_v5.sol:IexecLibOrders_v5"]:
          deploymentOptions.IexecLibOrders_v5,
      }),
    },
    {
      name: "IexecPocoBoostDelegate",
      abi: IexecPocoBoostDelegate__factory.abi,
      bytecode: IexecPocoBoostDelegate__factory.linkBytecode({
        ["contracts/libs/IexecLibOrders_v5.sol:IexecLibOrders_v5"]:
          deploymentOptions.IexecLibOrders_v5,
      }),
    },
    {
      name: "IexecPocoBoostAccessorsDelegate",
      abi: IexecPocoBoostAccessorsDelegate__factory.abi,
      bytecode: IexecPocoBoostAccessorsDelegate__factory.bytecode,
    },
  ];

  const genericFactoryInstance = GenericFactory__factory.connect(
    genericFactoryAddress,
    owner
  );

  for (const module of modules) {
    console.log(`Module: ${module.name}`);

    // Deploy modules through the factory
    const moduleAddress = await genericFactoryInstance.predictAddress(
      module.bytecode,
      salt
    );

    // avoid repeating deployment (would fail via factory)
    const addressBytecode = await ethers.provider.getCode(moduleAddress);
    if (addressBytecode == "0x") {
      await genericFactoryInstance
        .createContract(module.bytecode, salt)
        .then((tx) => tx.wait());
    } else {
      console.log("⚠️ module already deployed, skipping deployment ⚠️");
    }

    console.log(`${module.name} deployed at ${moduleAddress}`);

    // Link modules into the factory
    const proxy = ERC1538UpdateDelegate__factory.connect(
      IEXEC_HUB_ADDRESS,
      owner
    );
    const tx = await proxy
      .updateContract(
        moduleAddress,
        getFunctionSignatures(module.abi),
        "Linking " + module.name
      )
      .catch((e: any) => {
        console.log(e);
        throw new Error(`Failed to link ${module.name}`);
      });
    await tx.wait();

    console.log(`Link ${module.name} to proxy`);
  }

  const erc1538QueryInstance = ERC1538Query__factory.connect(
    IEXEC_HUB_ADDRESS,
    owner
  );
  const functionCount = await erc1538QueryInstance.totalFunctions();
  console.log(
    `The deployed ERC1538Proxy now supports ${functionCount} functions:`
  );
  for (let i = 0; i < functionCount.toNumber(); i++) {
    const [method, , contract] = await erc1538QueryInstance.functionByIndex(i);
    console.log(`[${i}] ${contract} ${method}`);
  }
};

main();
