import {
  EligibleAssetAdded,
  EligibleAssetRemoved,
  VoucherCreated,
  VoucherDebited,
  VoucherTypeCreated,
  VoucherTypeDescriptionUpdated,
  VoucherTypeDurationUpdated,
} from "../generated/VoucherHub/VoucherHub";
import { Voucher, VoucherType } from "../generated/schema";
import { Voucher as VoucherTemplate } from "../generated/templates";
import {
  loadOrCreateAccount,
  loadOrCreateAsset,
  loadOrCreateVoucherType,
} from "./utils";

export function handleEligibleAssetAdded(event: EligibleAssetAdded): void {
  let voucherTypeId = event.params.id.toString();
  let addedAssetId = event.params.asset.toHex();
  loadOrCreateAsset(addedAssetId);
  let voucherType = loadOrCreateVoucherType(voucherTypeId);
  let eligibleAssets = voucherType.eligibleAssets;
  let existingEntry = eligibleAssets.indexOf(addedAssetId);
  // add if not already in list
  if (existingEntry === -1) {
    eligibleAssets.push(addedAssetId);
    voucherType.eligibleAssets = eligibleAssets;
    voucherType.save();
  }
}

export function handleEligibleAssetRemoved(event: EligibleAssetRemoved): void {
  let voucherTypeId = event.params.id.toString();
  let removedAssetId = event.params.asset.toHex();
  loadOrCreateAsset(removedAssetId);
  let voucherType = loadOrCreateVoucherType(voucherTypeId);
  let eligibleAssets = voucherType.eligibleAssets;
  let existingEntry = eligibleAssets.indexOf(removedAssetId);
  // remove if exists
  if (existingEntry !== -1) {
    eligibleAssets.splice(existingEntry);
    voucherType.eligibleAssets = eligibleAssets;
    voucherType.save();
  }
}

export function handleVoucherCreated(event: VoucherCreated): void {
  let voucherId = event.params.voucher.toHex();
  let voucherTypeId = event.params.voucherType.toString();
  let voucherType = VoucherType.load(voucherTypeId);
  // do not index voucher created with voucherType not indexed
  if (voucherType) {
    let voucher = Voucher.load(voucherId);
    if (!voucher) {
      // start indexing events from created contract
      VoucherTemplate.create(event.params.voucher);
      voucher = new Voucher(voucherId);
      voucher.authorizedAccounts = [];
    }
    let owner = event.params.owner.toHex();
    let value = event.params.value;
    let expiration = event.params.expiration;
    loadOrCreateAccount(owner);
    voucher.voucherType = voucherTypeId;
    voucher.owner = owner;
    voucher.value = value;
    voucher.balance = value;
    voucher.expiration = expiration;
    voucher.save();
  }
}

export function handleVoucherDebited(event: VoucherDebited): void {
  let voucherId = event.params.voucher.toHex();
  let voucher = Voucher.load(voucherId);
  // do not index balance changes on voucher not indexed
  if (voucher) {
    let sponsoredAmount = event.params.sponsoredAmount;
    voucher.balance = voucher.balance.minus(sponsoredAmount);
  }
}

export function handleVoucherTypeCreated(event: VoucherTypeCreated): void {
  let id = event.params.id.toString();
  let description = event.params.description;
  let duration = event.params.duration;
  let voucherType = loadOrCreateVoucherType(id);
  voucherType.description = description;
  voucherType.duration = duration;
  voucherType.save();
}

export function handleVoucherTypeDescriptionUpdated(
  event: VoucherTypeDescriptionUpdated
): void {
  let id = event.params.id.toString();
  let description = event.params.description;
  let voucherType = loadOrCreateVoucherType(id);
  voucherType.description = description;
  voucherType.save();
}

export function handleVoucherTypeDurationUpdated(
  event: VoucherTypeDurationUpdated
): void {
  let id = event.params.id.toString();
  let duration = event.params.duration;
  let voucherType = loadOrCreateVoucherType(id);
  voucherType.duration = duration;
  voucherType.save();
}
