// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

import type { ApiTypes } from '@polkadot/api/types';
import type { Bytes, Null, Option, Result, U256, U8aFixed, Vec, bool, u128, u32, u64, u8 } from '@polkadot/types';
import type { AccountId32, H160, H256 } from '@polkadot/types/interfaces/runtime';
import type { FrameSupportTokensMiscBalanceStatus, FrameSupportWeightsDispatchInfo, PalletDemocracyVoteThreshold, PalletElectionProviderMultiPhaseElectionCompute, PalletImOnlineSr25519AppSr25519Public, PalletMultisigTimepoint, PalletStakingExposure, SpFinalityGrandpaAppPublic, SpRuntimeDispatchError } from '@polkadot/types/lookup';
import type { ITuple } from '@polkadot/types/types';

declare module '@polkadot/api/types/events' {
  export interface AugmentedEvents<ApiType> {
    ad: {
      /**
       * Advertiser bid for slot \[kol, id\]
       **/
      Bid: AugmentedEvent<ApiType, [H160, H256]>;
      /**
       * New advertisement created \[id\]
       **/
      Created: AugmentedEvent<ApiType, [H256]>;
      /**
       * Advertisement (in slot) deadline reached
       **/
      End: AugmentedEvent<ApiType, [H160, H256]>;
      /**
       * Advertisement updated \[id\]
       **/
      Updated: AugmentedEvent<ApiType, [H256]>;
    };
    advertiser: {
      /**
       * Advertiser was blocked \[id\]
       **/
      Blocked: AugmentedEvent<ApiType, [H160]>;
      /**
       * Advertiser deposited \[id, value\]
       **/
      Deposited: AugmentedEvent<ApiType, [H160, u128]>;
    };
    chainBridge: {
      /**
       * Chain now available for transfers (chain_id)
       **/
      ChainWhitelisted: AugmentedEvent<ApiType, [u8]>;
      /**
       * FunglibleTransfer is for relaying fungibles (dest_id, nonce, resource_id, amount, recipient, metadata)
       **/
      FungibleTransfer: AugmentedEvent<ApiType, [u8, u64, H256, U256, Bytes]>;
      /**
       * GenericTransfer is for a generic data payload (dest_id, nonce, resource_id, metadata)
       **/
      GenericTransfer: AugmentedEvent<ApiType, [u8, u64, H256, Bytes]>;
      /**
       * NonFungibleTransfer is for relaying NFTS (dest_id, nonce, resource_id, token_id, recipient, metadata)
       **/
      NonFungibleTransfer: AugmentedEvent<ApiType, [u8, u64, H256, Bytes, Bytes, Bytes]>;
      /**
       * Voting successful for a proposal
       **/
      ProposalApproved: AugmentedEvent<ApiType, [u8, u64]>;
      /**
       * Execution of call failed
       **/
      ProposalFailed: AugmentedEvent<ApiType, [u8, u64]>;
      /**
       * Voting rejected a proposal
       **/
      ProposalRejected: AugmentedEvent<ApiType, [u8, u64]>;
      /**
       * Execution of call succeeded
       **/
      ProposalSucceeded: AugmentedEvent<ApiType, [u8, u64]>;
      /**
       * Relayer added to set
       **/
      RelayerAdded: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * Relayer removed from set
       **/
      RelayerRemoved: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * Vote threshold has changed (new_threshold)
       **/
      RelayerThresholdChanged: AugmentedEvent<ApiType, [u32]>;
      /**
       * Vot submitted against proposal
       **/
      VoteAgainst: AugmentedEvent<ApiType, [u8, u64, AccountId32]>;
      /**
       * Vote submitted in favour of proposal
       **/
      VoteFor: AugmentedEvent<ApiType, [u8, u64, AccountId32]>;
    };
    did: {
      /**
       * New DID assigned \[did, account, inviter\]
       **/
      Assigned: AugmentedEvent<ApiType, [H160, AccountId32, Option<H160>]>;
      /**
       * DID was revoked \[did\]
       **/
      Revoked: AugmentedEvent<ApiType, [H160]>;
      /**
       * DID transferred \[did, from, to\]
       **/
      Transferred: AugmentedEvent<ApiType, [H160, AccountId32, AccountId32]>;
      /**
       * DID was updated \[did\]
       **/
      Updated: AugmentedEvent<ApiType, [H160]>;
    };
    linker: {
      /**
       * Account linked \[did, type, account\]
       **/
      AccountLinked: AugmentedEvent<ApiType, [H160, any, Bytes]>;
      /**
       * Pending link failed \[did, type, account\]
       **/
      ValidationFailed: AugmentedEvent<ApiType, [H160, any, Bytes]>;
    };
    magic: {
      /**
       * Controller changed \[stash, controller\]
       **/
      ChangedController: AugmentedEvent<ApiType, [AccountId32, AccountId32]>;
      /**
       * Proxy executed correctly \[ result \]
       **/
      Codo: AugmentedEvent<ApiType, [Result<Null, SpRuntimeDispatchError>]>;
      /**
       * Stable account created \[stash, controller\]
       **/
      CreatedStableAccount: AugmentedEvent<ApiType, [AccountId32, AccountId32]>;
    };
    nft: {
      /**
       * NFT fragments Minted \[did, kol, value\]
       **/
      Backed: AugmentedEvent<ApiType, [H160, H160, u128]>;
      /**
       * NFT fragments Claimed \[did, kol, value\]
       **/
      Claimed: AugmentedEvent<ApiType, [H160, H160, u128]>;
      /**
       * NFT fragments Minted \[kol, class, token, tokens\]
       **/
      Minted: AugmentedEvent<ApiType, [H160, u32, u32, u128]>;
    };
    swap: {
      /**
       * New swap pair created \[id\]
       **/
      Created: AugmentedEvent<ApiType, [u32]>;
      /**
       * Liquidity add \[id, account, liquidity, currency, tokens\]
       **/
      LiquidityAdded: AugmentedEvent<ApiType, [u32, AccountId32, u128, u128]>;
      /**
       * Liquidity removed \[id, account, currency, tokens\]
       **/
      LiquidityRemoved: AugmentedEvent<ApiType, [u32, AccountId32, u128, u128]>;
      /**
       * Tokens bought \[id, account, tokens, currency\]
       **/
      SwapBuy: AugmentedEvent<ApiType, [u32, AccountId32, u128, u128]>;
      /**
       * Tokens sold \[id, account, tokens, currency\]
       **/
      SwapSell: AugmentedEvent<ApiType, [u32, AccountId32, u128, u128]>;
    };
    tag: {
      /**
       * Tag created \[hash, creator\]
       **/
      Created: AugmentedEvent<ApiType, [Bytes, H160]>;
    };
    xAssets: {
      Remark: AugmentedEvent<ApiType, [H256]>;
    };
  }

  export interface DecoratedEvents<ApiType extends ApiTypes> extends AugmentedEvents<ApiType> {
  }
}
