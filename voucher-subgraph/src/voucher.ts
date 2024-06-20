import { PoCo as PoCoContract } from "../generated/VoucherHub/PoCo";
import { VoucherHub as VoucherHubContract } from "../generated/VoucherHub/VoucherHub";
import {
  Voucher as VoucherContract,
  AccountAuthorized,
  AccountUnauthorized,
  OrdersMatchedWithVoucher,
} from "../generated/templates/Voucher/Voucher";
import { Deal, Voucher } from "../generated/schema";
import { loadOrCreateAccount, loadOrCreateAsset } from "./utils";
import { Address, BigInt } from "@graphprotocol/graph-ts";

export function handleAccountAuthorized(event: AccountAuthorized): void {
  let voucherId = event.address.toHex();
  let authorizedAccountId = event.params.account.toHex();
  let voucher = Voucher.load(voucherId);
  if (voucher) {
    loadOrCreateAccount(authorizedAccountId);
    let authorizedAccounts = voucher.authorizedAccounts;
    let existingEntry = authorizedAccounts.indexOf(authorizedAccountId);
    // add if not already in list
    if (existingEntry === -1) {
      authorizedAccounts.push(authorizedAccountId);
      voucher.authorizedAccounts = authorizedAccounts;
      voucher.save();
    }
  }
}

export function handleAccountUnauthorized(event: AccountUnauthorized): void {
  let voucherId = event.address.toHex();
  let unauthorizedAccountId = event.params.account.toHex();
  let voucher = Voucher.load(voucherId);
  if (voucher) {
    loadOrCreateAccount(unauthorizedAccountId);
    let authorizedAccounts = voucher.authorizedAccounts;
    let existingEntry = authorizedAccounts.indexOf(unauthorizedAccountId);
    // remove if exists
    if (existingEntry !== -1) {
      authorizedAccounts.splice(existingEntry);
      voucher.authorizedAccounts = authorizedAccounts;
      voucher.save();
    }
  }
}

export function handleOrdersMatchedWithVoucher(
  event: OrdersMatchedWithVoucher
): void {
  let voucherId = event.address.toHex();
  let dealId = event.params.dealId.toHex();
  let voucher = Voucher.load(voucherId);
  // do not index if voucher is unknown
  if (voucher) {
    let voucherContract = VoucherContract.bind(event.address);
    let voucherHubContract = VoucherHubContract.bind(
      voucherContract.getVoucherHub()
    );
    let pocoContract = PoCoContract.bind(voucherHubContract.getIexecPoco());
    let sponsoredAmount = voucherContract.getSponsoredAmount(
      event.params.dealId
    );
    // do not index deals if sponsored amount is 0
    if (sponsoredAmount.gt(new BigInt(0))) {
      let deal = new Deal(dealId);
      deal.timestamp = event.block.timestamp;
      deal.sponsor = voucherId;
      deal.sponsoredAmount = sponsoredAmount;

      let pocoDeal = pocoContract.viewDeal(event.params.dealId);

      let app = loadOrCreateAsset(pocoDeal.app.pointer.toHex(), "app");
      deal.app = app.id;

      if (pocoDeal.dataset.pointer !== Address.zero()) {
        let dataset = loadOrCreateAsset(
          pocoDeal.dataset.pointer.toHex(),
          "dataset"
        );
        deal.dataset = dataset.id;
      }
      let workerpool = loadOrCreateAsset(
        pocoDeal.workerpool.pointer.toHex(),
        "workerpool"
      );
      deal.workerpool = workerpool.id;

      let requester = loadOrCreateAccount(pocoDeal.requester.toHex());
      deal.requester = requester.id;

      deal.appprice = pocoDeal.app.price;
      deal.datasetprice = pocoDeal.dataset.price;
      deal.workerpoolprice = pocoDeal.workerpool.price;

      deal.save();
    }
  }
}
