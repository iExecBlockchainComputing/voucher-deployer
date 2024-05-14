import { BigInt } from "@graphprotocol/graph-ts";
import { Account, Asset, VoucherType } from "../generated/schema";

export function loadOrCreateAccount(id: string): Account {
  let account = Account.load(id);
  if (!account) {
    account = new Account(id);
  }
  account.save();
  return account;
}

export function loadOrCreateAsset(id: string): Asset {
  let asset = Asset.load(id);
  if (!asset) {
    asset = new Asset(id);
  }
  asset.save();
  return asset;
}

export function loadOrCreateVoucherType(id: string): VoucherType {
  let voucherType = VoucherType.load(id);
  if (!voucherType) {
    voucherType = new VoucherType(id);
    voucherType.eligibleAssets = [];
    voucherType.description = "";
    voucherType.duration = new BigInt(0);
  }
  voucherType.save();
  return voucherType;
}
