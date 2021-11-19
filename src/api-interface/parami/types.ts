// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Compact, Option, Struct, Vec, i8, u128, u32, u64, u8 } from '@polkadot/types';
import type { AccountId, Balance, Moment, MultiAddress, MultiSigner, PerU16 } from '@polkadot/types/interfaces/runtime';
import type { ITuple } from '@polkadot/types/types';

/** @name Address */
export interface Address extends MultiAddress {}

/** @name AdId */
export interface AdId extends GlobalId {}

/** @name Advertisement */
export interface Advertisement extends Struct {
  readonly createdTime: Compact<Moment>;
  readonly deposit: Compact<Balance>;
  readonly tagCoefficients: Vec<ITuple<[TagType, TagCoefficient]>>;
  readonly signer: AccountId;
  readonly mediaRewardRate: Compact<PerU16>;
}

/** @name AdvertisementOf */
export interface AdvertisementOf extends Advertisement {}

/** @name Advertiser */
export interface Advertiser extends Struct {
  readonly createdTime: Compact<Moment>;
  readonly advertiserId: Compact<AdvertiserId>;
  readonly deposit: Compact<Balance>;
  readonly depositAccount: AccountId;
  readonly rewardPoolAccount: AccountId;
}

/** @name AdvertiserId */
export interface AdvertiserId extends GlobalId {}

/** @name AdvertiserOf */
export interface AdvertiserOf extends Advertiser {}

/** @name ChainId */
export interface ChainId extends u32 {}

/** @name ClassId */
export interface ClassId extends ITuple<[]> {}

/** @name DepositNonce */
export interface DepositNonce extends u64 {}

/** @name GlobalId */
export interface GlobalId extends u64 {}

/** @name LookupSource */
export interface LookupSource extends MultiAddress {}

/** @name NativeBalance */
export interface NativeBalance extends Balance {}

/** @name Public */
export interface Public extends MultiSigner {}

/** @name StableAccount */
export interface StableAccount extends Struct {
  readonly createdTime: Compact<Moment>;
  readonly stashAccount: AccountId;
  readonly controllerAccount: AccountId;
  readonly magicAccount: AccountId;
  readonly newControllerAccount: Option<AccountId>;
}

/** @name StableAccountOf */
export interface StableAccountOf extends StableAccount {}

/** @name SwapAssetBalance */
export interface SwapAssetBalance extends TAssetBalance {}

/** @name SwapPair */
export interface SwapPair extends Struct {
  readonly account: AccountId;
  readonly nativeReserve: Balance;
  readonly assetReserve: TAssetBalance;
}

/** @name TagCoefficient */
export interface TagCoefficient extends u8 {}

/** @name TagScore */
export interface TagScore extends i8 {}

/** @name TagType */
export interface TagType extends u8 {}

/** @name TAssetBalance */
export interface TAssetBalance extends u128 {}

/** @name TokenId */
export interface TokenId extends ITuple<[]> {}

export type PHANTOM_PARAMI = 'parami';
