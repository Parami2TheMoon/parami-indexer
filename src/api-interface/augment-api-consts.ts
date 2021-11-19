// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

import type { ApiTypes } from '@polkadot/api/types';
import type { U8aFixed, Vec, bool, u128, u16, u32, u64, u8 } from '@polkadot/types';
import type { Perbill, Percent, Permill } from '@polkadot/types/interfaces/runtime';
import type { FrameSupportPalletId, FrameSupportWeightsRuntimeDbWeight, FrameSupportWeightsWeightToFeeCoefficient, FrameSystemLimitsBlockLength, FrameSystemLimitsBlockWeights, PalletContractsSchedule, SpVersionRuntimeVersion } from '@polkadot/types/lookup';

declare module '@polkadot/api/types/consts' {
  export interface AugmentedConsts<ApiType> {
    ad: {
      /**
       * The pallet id, used for deriving "pot" accounts of budgets
       **/
      palletId: FrameSupportPalletId & AugmentedConst<ApiType>;
    };
    advertiser: {
      /**
       * Minimal deposit to become an advertiser
       **/
      minimalDeposit: u128 & AugmentedConst<ApiType>;
      /**
       * The pallet id, used for deriving "pot" accounts of deposits
       **/
      palletId: FrameSupportPalletId & AugmentedConst<ApiType>;
    };
    chainBridge: {
      /**
       * The identifier for this chain.
       * This must be unique and must not collide with existing IDs within a set of bridged chains.
       **/
      chainId: u8 & AugmentedConst<ApiType>;
      /**
       * Constant configuration parameter to store the module identifier for the pallet.
       * 
       * The module identifier may be of the form ```PalletId(*b"chnbrdge")``` and set
       * using the [`parameter_types`](https://substrate.dev/docs/en/knowledgebase/runtime/macros#parameter_types)
       **/
      palletId: FrameSupportPalletId & AugmentedConst<ApiType>;
      proposalLifetime: u32 & AugmentedConst<ApiType>;
    };
    did: {
      /**
       * The pallet id, used for deriving "pot" accounts to receive donation
       **/
      palletId: FrameSupportPalletId & AugmentedConst<ApiType>;
    };
    linker: {
      /**
       * Lifetime of a pending account
       **/
      pendingLifetime: u32 & AugmentedConst<ApiType>;
      /**
       * Unsigned Call Priority
       **/
      unsignedPriority: u64 & AugmentedConst<ApiType>;
    };
    magic: {
      /**
       * The pallet id, used for deriving stash accounts
       **/
      palletId: FrameSupportPalletId & AugmentedConst<ApiType>;
    };
    nft: {
      /**
       * The ICO baseline of donation for currency
       **/
      initialMintingDeposit: u128 & AugmentedConst<ApiType>;
      /**
       * The ICO value base of fragments, system will mint triple of the value
       * once for KOL, once to swaps, once to supporters
       **/
      initialMintingValueBase: u128 & AugmentedConst<ApiType>;
      /**
       * The maximum length of a name or symbol stored on-chain.
       **/
      stringLimit: u32 & AugmentedConst<ApiType>;
    };
    swap: {
      /**
       * The pallet id, used for deriving liquid accounts
       **/
      palletId: FrameSupportPalletId & AugmentedConst<ApiType>;
    };
    tag: {
      /**
       * Submission fee to create new tags
       **/
      submissionFee: u128 & AugmentedConst<ApiType>;
    };
  }

  export interface QueryableConsts<ApiType extends ApiTypes> extends AugmentedConsts<ApiType> {
  }
}
