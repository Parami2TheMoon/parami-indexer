// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

import type { ApiTypes } from '@polkadot/api/types';

declare module '@polkadot/api/types/errors' {
  export interface AugmentedErrors<ApiType> {
    ad: {
      Deadline: AugmentedError<ApiType>;
      DidNotExists: AugmentedError<ApiType>;
      EmptyTags: AugmentedError<ApiType>;
      InsufficientTokens: AugmentedError<ApiType>;
      NotExists: AugmentedError<ApiType>;
      NotMinted: AugmentedError<ApiType>;
      NotOwned: AugmentedError<ApiType>;
      ScoreOutOfRange: AugmentedError<ApiType>;
      TagNotExists: AugmentedError<ApiType>;
      Underbid: AugmentedError<ApiType>;
    };
    advertiser: {
      Blocked: AugmentedError<ApiType>;
      ExistentialDeposit: AugmentedError<ApiType>;
      Exists: AugmentedError<ApiType>;
      NotExists: AugmentedError<ApiType>;
    };
    chainBridge: {
      /**
       * Chain has already been enabled
       **/
      ChainAlreadyWhitelisted: AugmentedError<ApiType>;
      /**
       * Interactions with this chain is not permitted
       **/
      ChainNotWhitelisted: AugmentedError<ApiType>;
      /**
       * Provided chain Id is not valid
       **/
      InvalidChainId: AugmentedError<ApiType>;
      /**
       * Relayer threshold cannot be 0
       **/
      InvalidThreshold: AugmentedError<ApiType>;
      /**
       * Protected operation, must be performed by relayer
       **/
      MustBeRelayer: AugmentedError<ApiType>;
      /**
       * Proposal has either failed or succeeded
       **/
      ProposalAlreadyComplete: AugmentedError<ApiType>;
      /**
       * A proposal with these parameters has already been submitted
       **/
      ProposalAlreadyExists: AugmentedError<ApiType>;
      /**
       * No proposal with the ID was found
       **/
      ProposalDoesNotExist: AugmentedError<ApiType>;
      /**
       * Lifetime of proposal has been exceeded
       **/
      ProposalExpired: AugmentedError<ApiType>;
      /**
       * Cannot complete proposal, needs more votes
       **/
      ProposalNotComplete: AugmentedError<ApiType>;
      /**
       * Relayer already in set
       **/
      RelayerAlreadyExists: AugmentedError<ApiType>;
      /**
       * Relayer has already submitted some vote for this proposal
       **/
      RelayerAlreadyVoted: AugmentedError<ApiType>;
      /**
       * Provided accountId is not a relayer
       **/
      RelayerInvalid: AugmentedError<ApiType>;
      /**
       * Resource ID provided isn't mapped to anything
       **/
      ResourceDoesNotExist: AugmentedError<ApiType>;
      /**
       * Relayer threshold not set
       **/
      ThresholdNotSet: AugmentedError<ApiType>;
    };
    did: {
      Exists: AugmentedError<ApiType>;
      NotExists: AugmentedError<ApiType>;
      ReferrerNotExists: AugmentedError<ApiType>;
    };
    linker: {
      Deadline: AugmentedError<ApiType>;
      HttpFetchingError: AugmentedError<ApiType>;
      InvalidETHAddress: AugmentedError<ApiType>;
      InvalidSignature: AugmentedError<ApiType>;
      TaskNotExists: AugmentedError<ApiType>;
      UnexpectedAddress: AugmentedError<ApiType>;
      UnsupportedSite: AugmentedError<ApiType>;
    };
    magic: {
      ControllerAccountUsed: AugmentedError<ApiType>;
      ControllerEqualToMagic: AugmentedError<ApiType>;
      InsufficientBalance: AugmentedError<ApiType>;
      MagicAccountUsed: AugmentedError<ApiType>;
      ObsoletedMagicAccount: AugmentedError<ApiType>;
      StableAccountNotFound: AugmentedError<ApiType>;
    };
    nft: {
      BadMetadata: AugmentedError<ApiType>;
      InsufficientBalance: AugmentedError<ApiType>;
      Minted: AugmentedError<ApiType>;
      NotExists: AugmentedError<ApiType>;
      NoTokens: AugmentedError<ApiType>;
      Overflow: AugmentedError<ApiType>;
      YourSelf: AugmentedError<ApiType>;
    };
    swap: {
      Deadline: AugmentedError<ApiType>;
      Exists: AugmentedError<ApiType>;
      InsufficientCurrency: AugmentedError<ApiType>;
      InsufficientLiquidity: AugmentedError<ApiType>;
      InsufficientTokens: AugmentedError<ApiType>;
      NoLiquidity: AugmentedError<ApiType>;
      NotExists: AugmentedError<ApiType>;
      Overflow: AugmentedError<ApiType>;
      TooExpensiveCurrency: AugmentedError<ApiType>;
      TooExpensiveTokens: AugmentedError<ApiType>;
      TooLowCurrency: AugmentedError<ApiType>;
      TooLowLiquidity: AugmentedError<ApiType>;
      TooLowTokens: AugmentedError<ApiType>;
      ZeroCurrency: AugmentedError<ApiType>;
      ZeroLiquidity: AugmentedError<ApiType>;
      ZeroTokens: AugmentedError<ApiType>;
    };
    tag: {
      Exists: AugmentedError<ApiType>;
      InsufficientBalance: AugmentedError<ApiType>;
    };
    xAssets: {
      InvalidTransfer: AugmentedError<ApiType>;
    };
  }

  export interface DecoratedErrors<ApiType extends ApiTypes> extends AugmentedErrors<ApiType> {
  }
}
