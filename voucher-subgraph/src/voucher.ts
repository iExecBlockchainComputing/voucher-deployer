import { Voucher } from "../generated/schema";
import {
  AccountAuthorized,
  AccountUnauthorized,
  OrdersMatchedWithVoucher,
} from "../generated/templates/Voucher/Voucher";
import { loadOrCreateAccount } from "./utils";

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
  // TODO
}
