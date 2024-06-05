import hre, { ethers } from "hardhat";
import CONFIG from "../config/config.json";
import {
  ENSIntegrationDelegate__factory,
  ERC1538UpdateDelegate__factory,
  GenericFactory__factory,
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
      method: "anvil_impersonateAccount",
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
};

const main = async () => {
  const [owner] = await ethers.getSigners();

  await getPocoOwnership(owner.address);

  console.log("Deploying modules...");
  const modules = [
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
      name: "IexecAccessorsDelegate",
      abi: IexecPocoAccessorsDelegate__factory.abi,
      bytecode: IexecPocoAccessorsDelegate__factory.linkBytecode({
        ["contracts/libs/IexecLibOrders_v5.sol:IexecLibOrders_v5"]:
          deploymentOptions.IexecLibOrders_v5,
      }),
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
      name: "IexecMaintenanceExtraDelegate",
      abi: IexecMaintenanceExtraDelegate__factory.abi,
      bytecode: IexecMaintenanceExtraDelegate__factory.bytecode,
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
    await genericFactoryInstance
      .createContract(module.bytecode, salt)
      .then((tx) => tx.wait());
    console.log(`${module.name} deployed`);

    // Link modules into the factory
    const signatures: string[] = [];
    const moduleFactory = new ethers.ContractFactory(
      module.abi,
      module.bytecode,
      owner
    );
    moduleFactory.interface.fragments.forEach((fragment) => {
      if (fragment.type === "function") {
        signatures.push(fragment.format(ethers.utils.FormatTypes.full));
      }
    });

    // Join all signatures with semicolons
    const functionSignatures = signatures.join(";");

    const proxy = ERC1538UpdateDelegate__factory.connect(
      IEXEC_HUB_ADDRESS,
      owner
    );
    const tx = await proxy
      .updateContract(
        moduleAddress,
        functionSignatures,
        "Linking " + module.name
      )
      .catch((e: any) => {
        console.log(e);
        throw new Error(`Failed to link ${module.name}`);
      });
    await tx.wait();

    console.log(`Link ${module.name} to proxy`);
  }
};

main();
