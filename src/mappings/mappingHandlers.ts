import { ApiPromise } from "@polkadot/api";
import { SubstrateEvent, SubstrateBlock } from "@subql/types";
import {
  Did,
  AdvertisementReward,
  Advertisement,
  AdvertisementBudget,
  AdvertisementBid,
  Member,
  AssetPrice,
  Nft,
} from "../types";
import { AssetTransaction } from "../types";

const ChainStartTimeStamp = 1660130904;
const timeStamp = (blockNumber: number) => {
  return Math.floor(ChainStartTimeStamp + blockNumber * 12);
};

function guid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  logger.debug(
    "handleBlock got a block: ",
    block.block.header.number.toNumber()
  );

  if (block.block.header.number.toNumber() === 1) {
    logger.info("the first block, so read storage into subql storage");
    const apiAt = api;

    await recoverMembersFromGenesis(apiAt);
    await recoverNftsFromGenesis(apiAt);
    await recoverDidsFromGenesis(apiAt);
  }
}

async function recoverDidsFromGenesis(apiAt: ApiPromise) {
  logger.info("enter recoverDidsFromGenesis");
  let didMetas = await apiAt.query.did.metadata.entries();

  await Promise.all(
    didMetas.map((didMeta) => {
      const did = didMeta[0].toHuman() as any;
      const [account, revoked, created] = didMeta[1].toHuman() as any;
      let entity = new Did(guid());
      entity.did = did;
      entity.stashAccountId = account;
      return entity.save();
    })
  );
}

async function recoverNftsFromGenesis(apiAt: ApiPromise): Promise<void> {
  logger.info("enter recoverNftsFromGenesis");

  const nftIds = [0, 1, 7, 16, 42];

  const assetMetadatas = await Promise.all(
    nftIds.map((nftId) => {
      return apiAt.query.assets.metadata(nftId);
    })
  );

  const assetDetails = await Promise.all(
    nftIds.map((nftId) => {
      return apiAt.query.assets.asset(nftId);
    })
  );

  const nftMetas = await Promise.all(
    nftIds.map((nftId) => {
      return apiAt.query.nft.metadata(nftId);
    })
  );

  for (let i = 0; i < nftIds.length; i++) {
    const nftId = nftIds[i];
    const assetMetadata = assetMetadatas[i];
    const assetDetail = assetDetails[i].unwrap();
    const nftMeta = nftMetas[i];

    const nft = new Nft(nftId.toString());
    nft.type = 0; // native
    nft.status = 1; // minted
    nft.assetId = nftId.toString();
    nft.assetName = assetMetadata.name.toHuman().toString();
    nft.assetSymbol = assetMetadata.symbol.toHuman().toString();
    nft.assetAmount = BigInt(assetDetail.supply.toString().replace(/,/g, ""));
    nft.kolDid = (nftMeta.toHuman() as any).owner.toString();
    await nft.save();
    logger.info(`saved nft, id = ${nftId}`);
  }
}

async function recoverMembersFromGenesis(apiAt: ApiPromise): Promise<void> {
  logger.info(`enter recoverMembersFromGenesis`);
  const assetIter = await apiAt.query.assets.asset.entries();
  logger.info(`got ${assetIter.length} assets`);

  const promises = assetIter.map(([key, _value]) => {
    const [assetId] = key.args;
    return saveAllAccountIdsOfAsset(apiAt, assetId.toNumber());
  });

  Promise.all(promises);
}

async function saveAllAccountIdsOfAsset(
  apiAt: ApiPromise,
  assetId: number
): Promise<void> {
  logger.info(`enter process of assetId = ${assetId}`);

  let promises: Promise<void>[] = [];

  const iter = await apiAt.query.assets.account.entries(assetId);

  iter.forEach(([key, _value]) => {
    const [assetId, accountId] = key.args;
    const member = new Member(accountId.toString() + "." + assetId.toString());
    member.accountId = accountId.toString();
    member.assetId = assetId.toString();
    promises.push(member.save());
  });

  logger.info(`got ${promises.length} member for assetId = ${assetId}`);

  await Promise.all(promises);
}
/**
 * {"phase":{"ApplyExtrinsic":"1"},"event":{"method":"Assigned","section":"did","index":"0x2600","data":["0x12816265b2a84ce366f674995e5c439365712c55","5EYCAe5ijQkVKBy52wmGD3kJnFQ8CmyVD9U2ecNMQFoepQvb",null]},"topics":[]}
 * @param event
 */
export async function handleDidAssigned(event: SubstrateEvent): Promise<void> {
  logger.info(
    `mappingHandler got a DidAssigned event: ${JSON.stringify(event.toHuman())}`
  );
  const {
    event: {
      data: [did, stashAccount],
    },
  } = event;
  const record = new Did(guid());
  record.did = did.toHuman() as string;
  record.stashAccountId = stashAccount.toString();
  record.blockHash = event.block.hash.toString();
  record.extrinsicHash = event.extrinsic?.extrinsic.hash.toString();
  await record.save();
}

export async function handleDidTransferred(
  event: SubstrateEvent
): Promise<void> {
  logger.info(
    `mappingHandler got a Did::Transferred event: ${JSON.stringify(
      event.toHuman()
    )}`
  );
  const {
    event: {
      data: [did, _oldStashAccount, newStashAccount],
    },
  } = event;
  const record = new Did(guid());
  record.did = did.toHuman() as string;
  record.stashAccountId = newStashAccount.toString();
  record.blockHash = event.block.hash.toString();
  record.extrinsicHash = event.extrinsic?.extrinsic.hash.toString();
  await record.save();
}

export async function handleAdPayout(event: SubstrateEvent): Promise<void> {
  logger.info(
    `handleAdPayout got a Paid event: ${JSON.stringify(event.toHuman())}`
  );
  const {
    event: {
      data: [id, assetId, visitor, reward, referer, award],
    },
  } = event;
  const advertisementReward = new AdvertisementReward(guid());
  advertisementReward.advertisementId = id.toString();
  advertisementReward.reward = BigInt(reward.toString());
  advertisementReward.award = BigInt(award.toString());
  advertisementReward.refererDid = referer.toString();
  advertisementReward.visitorDid = visitor.toString();
  advertisementReward.assetId = assetId.toString();
  advertisementReward.timestampInSecond = timeStamp(
    event.block.block.header.number.toNumber()
  );
  await advertisementReward.save();
}

/**
 *
 * @param event data: 		Issued { asset_id: T::AssetId, owner: T::AccountId, total_supply: T::Balance },
 */
export async function handleAssetIssued(event: SubstrateEvent): Promise<void> {
  logger.info(
    `handleAssetIssued got event: ${JSON.stringify(event.toHuman())}`
  );
  const {
    event: {
      data: [assetId, owner, total_supply],
    },
  } = event;
  const member = new Member(owner.toString() + "." + assetId.toString());
  member.accountId = owner.toString();
  member.assetId = assetId.toString();
  await member.save();

  const tx = new AssetTransaction(guid());
  tx.assetId = assetId.toString();
  tx.block = event.block.block.hash.toString();
  tx.fromAccountId = "0";
  tx.toAccountId = owner.toString();
  tx.amount = BigInt(total_supply.toString().replace(/,/g, ""));
  tx.timestampInSecond = timeStamp(event.block.block.header.number.toNumber());
  await tx.save();
}

/**
 *
 * @param event 		data: 		Transferred(T::AssetId, T::AccountId, T::AccountId, T::Balance)
 */
export async function handleAssetTransferred(
  event: SubstrateEvent
): Promise<void> {
  logger.info(
    `handleAssetTransferred got event: ${JSON.stringify(event.toHuman())}`
  );
  const {
    event: {
      data: [assetId, fromAccountId, toAccountId, balance],
    },
  } = event;
  const member = new Member(toAccountId.toString() + "." + assetId.toString());
  member.accountId = toAccountId.toString();
  member.assetId = assetId.toString();
  await member.save();
  const tx = new AssetTransaction(guid());
  tx.assetId = assetId.toString();
  tx.block = event.block.block.hash.toString();
  tx.fromAccountId = fromAccountId.toString();
  tx.toAccountId = toAccountId.toString();
  tx.amount = BigInt(balance.toString().replace(/,/g, ""));
  tx.timestampInSecond = timeStamp(event.block.block.header.number.toNumber());
  await tx.save();
}

/**
 *
 * @param event 		data: 		Burned(T::AssetId, T::AccountId, T::Balance),
 */
export async function handleAssetBurned(event: SubstrateEvent): Promise<void> {
  logger.info(
    `mappingHandler got a AssetBurned event: ${JSON.stringify(event.toHuman())}`
  );
  const {
    event: {
      data: [assetId, accountId, balance],
    },
  } = event;
  const tx = new AssetTransaction(guid());
  tx.assetId = assetId.toString();
  tx.fromAccountId = accountId.toString();
  tx.block = event.block.block.hash.toString();
  tx.toAccountId = "burned";
  tx.amount = BigInt(balance.toString().replace(/,/g, ""));
  tx.timestampInSecond = timeStamp(event.block.block.header.number.toNumber());
  await tx.save();
}

//balance.Transfer
export async function handleAd3Transaction(
  event: SubstrateEvent
): Promise<void> {
  logger.info(
    `handleAd3Transaction got a Paid event: ${JSON.stringify(event.toHuman())}`
  );
  const {
    event: {
      data: [fromAccountId, toAccountId, value],
    },
  } = event;
  const tx = new AssetTransaction(guid());
  tx.assetId = "AD3";
  tx.block = event.block.block.hash.toString();
  tx.fromAccountId = fromAccountId.toString();
  tx.toAccountId = toAccountId.toString();

  const valueAfterReplace = value.toHuman().toString().replace(/,/g, "");
  tx.amount = BigInt(valueAfterReplace);
  tx.timestampInSecond = timeStamp(event.block.block.header.number.toNumber());
  await tx.save();
}

//ad.Deposited
export async function handleAdvertisementCreate(
  event: SubstrateEvent
): Promise<void> {
  logger.info(
    `handleAdvertisementCreate got an event: ${JSON.stringify(event.toHuman())}`
  );
  const {
    event: {
      data: [id, did],
    },
  } = event;
  logger.info(`handleAdvertisementCreate: id is ${id}, did is ${did}`);
  const advertisement = new Advertisement(id.toString());
  advertisement.advertiser = did.toString();
  advertisement.timestampInSecond = timeStamp(
    event.block.block.header.number.toNumber()
  );
  await advertisement.save();
}
export async function handleAdvertisementBid(
  event: SubstrateEvent
): Promise<void> {
  logger.info(
    `handleAdvertisementBid handled an event: ${JSON.stringify(
      event.toHuman()
    )}`
  );
  const {
    event: {
      data: [nftId, adId, value],
    },
  } = event;
  const advertisementBid = new AdvertisementBid(guid());
  advertisementBid.nftId = nftId.toString();
  advertisementBid.advertisementId = adId.toString();
  const ad = await Advertisement.get(adId.toString());
  advertisementBid.advertiser = ad.advertiser;
  advertisementBid.amount = BigInt(value.toString().replace(/,/g, ""));
  advertisementBid.timestampInSecond = timeStamp(
    event.block.block.header.number.toNumber()
  );
  advertisementBid.active = true;
  await advertisementBid.save();
}

export async function handleAdvertisementBidEnd(
  event: SubstrateEvent
): Promise<void> {
  logger.info(
    `handleAdvertisementBidEnd handled an event: ${JSON.stringify(
      event.toHuman()
    )}`
  );
  const {
    event: {
      data: [nftId, adId, value],
    },
  } = event;

  const bids = await AdvertisementBid.getByNftId(adId.toString());
  await Promise.all(
    bids
      .filter((bid) => bid.nftId === nftId.toString())
      .map(async (bid) => {
        bid.active = false;
        await bid.save();
      })
  );
}

export async function handleSlotRemainChanged(
  event: SubstrateEvent
): Promise<void> {
  logger.info(
    `handleSlotRemainChanged handled an event: ${JSON.stringify(
      event.toHuman()
    )}`
  );
  const {
    event: {
      data: [id, kol, value],
    },
  } = event;
  const advertisementBudget = new AdvertisementBudget(guid());
  advertisementBudget.kolDid = kol.toString();
  advertisementBudget.advertisementId = id.toString();
  advertisementBudget.remain = BigInt(value.toString().replace(/,/g, ""));
  advertisementBudget.timestampInSecond = timeStamp(
    event.block.block.header.number.toNumber()
  );
  await advertisementBudget.save();
}
//ad.Bid
// ad.slotOf: Option<ParamiAdSlot>
// {
//   nft: 0
//   budget: 20,000,000,000,000,000,000
//   remain: 18,000,000,000,000,000,000
//   tokens: 1,989,981,876,438,381,866,558
//   deadline: 43,377
//   created: 177
//   ad: 0x3091130280355378191cfc607dc6df4f18e536f7907fb9cd550a4f25c2673d6a
// }
// /// Tokens bought \[id, account, tokens, currency\]
// SwapBuy(T::AssetId, AccountOf<T>, BalanceOf<T>, BalanceOf<T>),
// /// Tokens sold \[id, account, tokens, currency\]
// SwapSell(T::AssetId, AccountOf<T>, BalanceOf<T>, BalanceOf<T>),
// export async function handleSwapBuy(event: SubstrateEvent): Promise<void> {
//     const { event: { data: [id, account, tokens, currency] } } = event;
//     const price = new AssetPrice(guid());
//     price.assetId = id.toString();
//     price.price = BigInt(tokens.toString().replace(/,/g, '')) / BigInt(currency.toString().replace(/,/g, ''));
//     price.timestampInSecond = timeStamp(event.block.block.header.number.toNumber());
//     price.save().then(() => {
//         logger.info(`handleSwapBuy saved success for from account: ${JSON.stringify(price.price.toString())}`);
//     });
// }

export async function handleTokenSold(event: SubstrateEvent): Promise<void> {
  // const { event: { data: [id, account, tokens, currency] } } = event;
  // const price = new AssetPrice(guid());
  // price.assetId = id.toString();
  // price.price = BigInt(tokens.toString().replace(/,/g, '')) / BigInt(currency.toString().replace(/,/g, ''));
  // price.timestampInSecond = timeStamp(event.block.block.header.number.toNumber());
  // price.save().then(() => {
  //     logger.info(`handleTokenSold saved success for from account: ${JSON.stringify(price.price.toString())}`);
  // });
}
export async function handleTokenBought(event: SubstrateEvent): Promise<void> {
  logger.info(
    `handleTokenBought handled an event: ${JSON.stringify(event.toHuman())}`
  );
  const {
    event: {
      data: [id, account, tokens, currency],
    },
  } = event;
  const price = new AssetPrice(guid());
  price.assetId = id.toString();
  price.price =
    BigInt(tokens.toString().replace(/,/g, "")) /
    BigInt(currency.toString().replace(/,/g, ""));
  price.timestampInSecond = timeStamp(
    event.block.block.header.number.toNumber()
  );
  await price.save();
}

//subquery-node_1   | 2022-12-09T10:37:04.002Z <sandbox> INFO handleNftCreated handled an event: {"phase":{"ApplyExtrinsic":"2"},"event":{"method":"Created","section":"nft","index":"0x6b00","data":["0x9b618f7cc7c6d2d4c77ba4dc9b05910c3f5c7e40","29,911"]},"topics":[]}
export async function handleNftCreated(event: SubstrateEvent): Promise<void> {
  logger.info(
    `handleNftCreated handled an event: ${JSON.stringify(event.toHuman())}`
  );
  const {
    event: {
      data: [did, nftId],
    },
  } = event;
  Nft.get(nftId.toString()).then(async (nft) => {
    if (!nft) {
      nft = new Nft(nftId.toString());
    }
    if (event.extrinsic.extrinsic.method.method.indexOf("port") > -1) {
      nft.type = 1; // imported
    } else {
      nft.type = 0; // native
    }
    nft.status = 0; // created
    nft.kolDid = did.toString();
    try {
      await nft.save();
    } catch (err) {
      console.error("handleNftCreated got error", err);
      throw err;
    }
  });
}
export async function handleNftMinted(event: SubstrateEvent): Promise<void> {
  const {
    event: {
      data: [did, nftId, assetId, assetName, assetSymbol, assetAmount],
    },
  } = event;
  Nft.get(nftId.toString()).then(async (nft) => {
    if (nft) {
      nft.kolDid = did.toString();
      nft.status = 1; // minted
      nft.assetId = assetId.toString();
      nft.assetName = assetName.toHuman().toString();
      nft.assetSymbol = assetSymbol.toHuman().toString();
      nft.assetAmount = BigInt(assetAmount.toString().replace(/,/g, ""));
      await nft.save();
    } else {
      const nft = new Nft(nftId.toString());
      nft.kolDid = did.toString();
      nft.type = 0; // native
      nft.status = 1; // minted
      nft.assetId = assetId.toString();
      nft.assetName = assetName.toHuman().toString();
      nft.assetSymbol = assetSymbol.toHuman().toString();
      nft.assetAmount = BigInt(assetAmount.toString().replace(/,/g, ""));
      await nft.save();
    }
  });
}
