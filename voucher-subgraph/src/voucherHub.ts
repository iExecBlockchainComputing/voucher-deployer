import {
  EligibleAssetAdded,
  EligibleAssetRemoved,
  VoucherCreated,
  VoucherDebited,
  VoucherDrained,
  VoucherHub,
  VoucherRefunded,
  VoucherToppedUp,
  VoucherTypeCreated,
  VoucherTypeDescriptionUpdated,
  VoucherTypeDurationUpdated,
} from "../generated/VoucherHub/VoucherHub";
import { PoCo } from "../generated/VoucherHub/PoCo";
import { AppRegistry } from "../generated/VoucherHub/AppRegistry";
import { DatasetRegistry } from "../generated/VoucherHub/DatasetRegistry";
import { WorkerpoolRegistry } from "../generated/VoucherHub/WorkerpoolRegistry";
import { Voucher, VoucherType } from "../generated/schema";
import { Voucher as VoucherTemplate } from "../generated/templates";
import {
  loadOrCreateAccount,
  loadOrCreateApp,
  loadOrCreateDataset,
  loadOrCreateWorkerpool,
} from "./utils";

export function handleEligibleAssetAdded(event: EligibleAssetAdded): void {
  let voucherTypeId = event.params.id.toString();
  let addedAssetAddress = event.params.asset;

  let voucherType = VoucherType.load(voucherTypeId);
  // do not index changes on non voucherType not indexed
  if (voucherType) {
    // check asset type
    let voucherHubContract = VoucherHub.bind(event.address);
    let pocoContract = PoCo.bind(voucherHubContract.getIexecPoco());
    let isRegistredAsset = false;
    if (
      AppRegistry.bind(pocoContract.appregistry()).isRegistered(
        addedAssetAddress
      )
    ) {
      loadOrCreateApp(addedAssetAddress);
      isRegistredAsset = true;
    } else if (
      DatasetRegistry.bind(pocoContract.datasetregistry()).isRegistered(
        addedAssetAddress
      )
    ) {
      loadOrCreateDataset(addedAssetAddress);
      isRegistredAsset = true;
    } else if (
      WorkerpoolRegistry.bind(pocoContract.workerpoolregistry()).isRegistered(
        addedAssetAddress
      )
    ) {
      loadOrCreateWorkerpool(addedAssetAddress);
      isRegistredAsset = true;
    }
    // index only apps, datasets and workerpools
    if (isRegistredAsset) {
      let addedAssetId = addedAssetAddress.toHex();
      let eligibleAssets = voucherType.eligibleAssets;
      let existingEntry = eligibleAssets.indexOf(addedAssetId);
      // add if not already in list
      if (existingEntry === -1) {
        eligibleAssets.push(addedAssetId);
        voucherType.eligibleAssets = eligibleAssets;
        voucherType.save();
      }
    }
  }
}

export function handleEligibleAssetRemoved(event: EligibleAssetRemoved): void {
  let voucherTypeId = event.params.id.toString();
  let voucherType = VoucherType.load(voucherTypeId);
  // do not index changes on non voucherType not indexed
  if (voucherType) {
    let removedAssetId = event.params.asset.toHex();
    let eligibleAssets = voucherType.eligibleAssets;
    let existingEntry = eligibleAssets.indexOf(removedAssetId);
    // remove if exists
    if (existingEntry !== -1) {
      eligibleAssets.splice(existingEntry);
      voucherType.eligibleAssets = eligibleAssets;
      voucherType.save();
    }
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
    voucher.save();
  }
}

export function handleVoucherDrained(event: VoucherDrained): void {
  // TODO
}

export function handleVoucherRefunded(event: VoucherRefunded): void {
  // TODO
}

export function handleVoucherToppedUp(event: VoucherToppedUp): void {
  // TODO
}

export function handleVoucherTypeCreated(event: VoucherTypeCreated): void {
  let id = event.params.id.toString();
  let description = event.params.description;
  let duration = event.params.duration;
  let voucherType = VoucherType.load(id);
  if (!voucherType) {
    voucherType = new VoucherType(id);
    voucherType.eligibleAssets = [];
  }
  voucherType.description = description;
  voucherType.duration = duration;
  voucherType.save();
}

export function handleVoucherTypeDescriptionUpdated(
  event: VoucherTypeDescriptionUpdated
): void {
  let id = event.params.id.toString();
  let description = event.params.description;
  let voucherType = VoucherType.load(id);
  // do not index changes on non voucherType not indexed
  if (voucherType) {
    voucherType.description = description;
    voucherType.save();
  }
}

export function handleVoucherTypeDurationUpdated(
  event: VoucherTypeDurationUpdated
): void {
  let id = event.params.id.toString();
  let duration = event.params.duration;
  let voucherType = VoucherType.load(id);
  // do not index changes on non voucherType not indexed
  if (voucherType) {
    voucherType.duration = duration;
    voucherType.save();
  }
}
