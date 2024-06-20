export const voucherAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "InvalidInitialization",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotInitializing",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "AccountAuthorized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "AccountUnauthorized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "expiration",
        "type": "uint256"
      }
    ],
    "name": "ExpirationUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "version",
        "type": "uint64"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "dealId",
        "type": "bytes32"
      }
    ],
    "name": "OrdersBoostMatchedWithVoucher",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "dealId",
        "type": "bytes32"
      }
    ],
    "name": "OrdersMatchedWithVoucher",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "taskId",
        "type": "bytes32"
      }
    ],
    "name": "TaskClaimedWithVoucher",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "authorizeAccount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "taskId",
        "type": "bytes32"
      }
    ],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "dealId",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "taskIndex",
        "type": "uint256"
      }
    ],
    "name": "claimBoost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "drain",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getExpiration",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "dealId",
        "type": "bytes32"
      }
    ],
    "name": "getSponsoredAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getType",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVoucherHub",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "voucherOwner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "voucherHub",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "expiration",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "voucherTypeId",
        "type": "uint256"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "isAccountAuthorized",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "app",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "appprice",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "volume",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "tag",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "datasetrestrict",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "workerpoolrestrict",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "requesterrestrict",
            "type": "address"
          },
          {
            "internalType": "bytes32",
            "name": "salt",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "sign",
            "type": "bytes"
          }
        ],
        "internalType": "struct IexecLibOrders_v5.AppOrder",
        "name": "appOrder",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "dataset",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "datasetprice",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "volume",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "tag",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "apprestrict",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "workerpoolrestrict",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "requesterrestrict",
            "type": "address"
          },
          {
            "internalType": "bytes32",
            "name": "salt",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "sign",
            "type": "bytes"
          }
        ],
        "internalType": "struct IexecLibOrders_v5.DatasetOrder",
        "name": "datasetOrder",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "workerpool",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "workerpoolprice",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "volume",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "tag",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "category",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "trust",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "apprestrict",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "datasetrestrict",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "requesterrestrict",
            "type": "address"
          },
          {
            "internalType": "bytes32",
            "name": "salt",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "sign",
            "type": "bytes"
          }
        ],
        "internalType": "struct IexecLibOrders_v5.WorkerpoolOrder",
        "name": "workerpoolOrder",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "app",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "appmaxprice",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "dataset",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "datasetmaxprice",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "workerpool",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "workerpoolmaxprice",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "requester",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "volume",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "tag",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "category",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "trust",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "beneficiary",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "callback",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "params",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "salt",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "sign",
            "type": "bytes"
          }
        ],
        "internalType": "struct IexecLibOrders_v5.RequestOrder",
        "name": "requestOrder",
        "type": "tuple"
      }
    ],
    "name": "matchOrders",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "dealId",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "app",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "appprice",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "volume",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "tag",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "datasetrestrict",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "workerpoolrestrict",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "requesterrestrict",
            "type": "address"
          },
          {
            "internalType": "bytes32",
            "name": "salt",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "sign",
            "type": "bytes"
          }
        ],
        "internalType": "struct IexecLibOrders_v5.AppOrder",
        "name": "appOrder",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "dataset",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "datasetprice",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "volume",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "tag",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "apprestrict",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "workerpoolrestrict",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "requesterrestrict",
            "type": "address"
          },
          {
            "internalType": "bytes32",
            "name": "salt",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "sign",
            "type": "bytes"
          }
        ],
        "internalType": "struct IexecLibOrders_v5.DatasetOrder",
        "name": "datasetOrder",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "workerpool",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "workerpoolprice",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "volume",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "tag",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "category",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "trust",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "apprestrict",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "datasetrestrict",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "requesterrestrict",
            "type": "address"
          },
          {
            "internalType": "bytes32",
            "name": "salt",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "sign",
            "type": "bytes"
          }
        ],
        "internalType": "struct IexecLibOrders_v5.WorkerpoolOrder",
        "name": "workerpoolOrder",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "app",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "appmaxprice",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "dataset",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "datasetmaxprice",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "workerpool",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "workerpoolmaxprice",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "requester",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "volume",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "tag",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "category",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "trust",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "beneficiary",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "callback",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "params",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "salt",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "sign",
            "type": "bytes"
          }
        ],
        "internalType": "struct IexecLibOrders_v5.RequestOrder",
        "name": "requestOrder",
        "type": "tuple"
      }
    ],
    "name": "matchOrdersBoost",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "dealId",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "expiration",
        "type": "uint256"
      }
    ],
    "name": "setExpiration",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "unauthorizeAccount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
