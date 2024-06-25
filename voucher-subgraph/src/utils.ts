import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Account,
  App,
  Dataset,
  VoucherType,
  Workerpool,
} from "../generated/schema";
import { App as AppContract } from "../generated/templates/Voucher/App";
import { Dataset as DatasetContract } from "../generated/templates/Voucher/Dataset";
import { Workerpool as WorkerpoolContract } from "../generated/templates/Voucher/Workerpool";

export function loadOrCreateAccount(id: string): Account {
  let account = Account.load(id);
  if (!account) {
    account = new Account(id);
    account.save();
  }
  return account;
}

export function loadOrCreateVoucherType(id: string): VoucherType {
  let voucherType = VoucherType.load(id);
  if (!voucherType) {
    voucherType = new VoucherType(id);
    voucherType.eligibleAssets = [];
    voucherType.description = "";
    voucherType.duration = new BigInt(0);
    voucherType.save();
  }
  return voucherType;
}

export function loadOrCreateApp(address: Address): App {
  let app = App.load(address.toHex());
  if (!app) {
    app = new App(address.toHex());
    let contract = AppContract.bind(address);
    app.name = contract.m_appName();
    app.save();
  }
  return app;
}

export function loadOrCreateDataset(address: Address): Dataset {
  let dataset = Dataset.load(address.toHex());
  if (!dataset) {
    dataset = new Dataset(address.toHex());
    let contract = DatasetContract.bind(address);
    dataset.name = contract.m_datasetName();
    dataset.save();
  }
  return dataset;
}

export function loadOrCreateWorkerpool(address: Address): Workerpool {
  let workerpool = Workerpool.load(address.toHex());
  if (!workerpool) {
    workerpool = new Workerpool(address.toHex());
    let contract = WorkerpoolContract.bind(address);
    workerpool.description = contract.m_workerpoolDescription();
    workerpool.save();
  }
  return workerpool;
}
