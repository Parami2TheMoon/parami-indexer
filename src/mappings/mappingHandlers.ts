import { SubstrateEvent, SubstrateBlock } from "@subql/types";
import { Asset, Did, AdvertisementReward, Advertisement, AdvertisementBudget, AdvertisementBid, Member, AssetPrice, Nft } from "../types";
import { AssetTransaction } from "../types";

const ChainStartTimeStamp = 1646205156;
const timeStamp = (blockNumber: number) => {
    return Math.floor(ChainStartTimeStamp + blockNumber * 12);
}

function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

export async function handleBlock(block: SubstrateBlock): Promise<void> {
    logger.debug("mappingHandler got a block: ", block.block.header.number.toNumber());
}
/**
 * {"phase":{"ApplyExtrinsic":"1"},"event":{"method":"Assigned","section":"did","index":"0x2600","data":["0x12816265b2a84ce366f674995e5c439365712c55","5EYCAe5ijQkVKBy52wmGD3kJnFQ8CmyVD9U2ecNMQFoepQvb",null]},"topics":[]}
 * @param event 
 */
export async function handleDidAssigned(event: SubstrateEvent): Promise<void> {
    logger.info(`mappingHandler got a DidAssigned event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [did, stashAccount] } } = event;
    const record = new Did(guid());
    record.did = did.toHuman() as string;
    record.stashAccountId = stashAccount.toString();
    record.blockHash = event.block.hash.toString();
    record.extrinsicHash = event.extrinsic?.extrinsic.hash.toString();
    await record.save();
}

export async function handleDidTransferred(event: SubstrateEvent): Promise<void> {
    logger.info(`mappingHandler got a Did::Transferred event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [did, _oldStashAccount, newStashAccount] } } = event;
    const record = new Did(guid());
    record.did = did.toHuman() as string;
    record.stashAccountId = newStashAccount.toString();
    record.blockHash = event.block.hash.toString();
    record.extrinsicHash = event.extrinsic?.extrinsic.hash.toString();
    await record.save();
}

export async function handleAdPayout(event: SubstrateEvent): Promise<void> {
    logger.info(`handleAdPayout got a Paid event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [id, assetId, visitor, reward, referer, award] } } = event;
    const advertisementReward = new AdvertisementReward(guid());
    advertisementReward.advertisementId = id.toString();
    advertisementReward.reward = BigInt(reward.toString());
    advertisementReward.award = BigInt(award.toString());
    advertisementReward.refererDid = referer.toString();
    advertisementReward.visitorDid = visitor.toString();
    advertisementReward.assetId = assetId.toString();
    advertisementReward.timestampInSecond = timeStamp(event.block.block.header.number.toNumber());
    await advertisementReward.save();
}

/**
 * 
 * @param event 		data: 		Transferred(T::AssetId, T::AccountId, T::AccountId, T::Balance)
 */
export async function handleAssetTransferred(event: SubstrateEvent): Promise<void> {
    logger.info(`handleAssetTransferred got event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [assetId, fromAccountId, toAccountId, balance] } } = event;
    const member = new Member(toAccountId.toString() + '.' + assetId.toString());
    member.accountId = toAccountId.toString();
    member.assetId = assetId.toString();
    await member.save();
    const tx = new AssetTransaction(guid());
    tx.assetId = assetId.toString();
    tx.block = event.block.block.hash.toString();
    tx.fromAccountId = fromAccountId.toString();
    tx.toAccountId = toAccountId.toString();
    tx.amount = BigInt(balance.toString().replace(/,/g, ''));
    tx.timestampInSecond = timeStamp(event.block.block.header.number.toNumber());
    await tx.save();
}

/**
 * 
 * @param event 		data: 		Burned(T::AssetId, T::AccountId, T::Balance),
 */
export async function handleAssetBurned(event: SubstrateEvent): Promise<void> {
    logger.info(`mappingHandler got a AssetBurned event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [assetId, accountId, balance] } } = event;
    const tx = new AssetTransaction(guid());
    tx.assetId = assetId.toString();
    tx.fromAccountId = accountId.toString();
    tx.block = event.block.block.hash.toString();
    tx.toAccountId = "burned";
    tx.amount = BigInt(balance.toString().replace(/,/g, ''));
    tx.timestampInSecond = timeStamp(event.block.block.header.number.toNumber());
    await tx.save();
}

//balance.Transfer
export async function handleAd3Transaction(event: SubstrateEvent): Promise<void> {
    logger.info(`handleAd3Transaction got a Paid event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [fromAccountId, toAccountId, value] } } = event;
    const tx = new AssetTransaction(guid());
    tx.assetId = 'AD3';
    tx.block = event.block.block.hash.toString();
    tx.fromAccountId = fromAccountId.toString();
    tx.toAccountId = toAccountId.toString();

    const valueAfterReplace = value.toHuman().toString().replace(/,/g, '');;
    tx.amount = BigInt(valueAfterReplace);
    tx.timestampInSecond = timeStamp(event.block.block.header.number.toNumber());
    await tx.save();
}

//ad.Deposited
export async function handleAdvertisementCreate(event: SubstrateEvent): Promise<void> {
    logger.info(`handleAdvertisementCreate got an event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [id, did, value] } } = event;
    const advertisement = new Advertisement(id.toString());
    advertisement.budgetInAd3 = BigInt(value.toString().replace(/,/g, ''));
    advertisement.advertiser = did.toString();
    advertisement.timestampInSecond = timeStamp(event.block.block.header.number.toNumber());
    await advertisement.save();
}
export async function handleAdvertisementBid(event: SubstrateEvent): Promise<void> {
    logger.info(`handleAdvertisementBid handled an event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [nftId, adId, value] } } = event;
    const advertisementBid = new AdvertisementBid(guid());
    advertisementBid.nftId = nftId.toString();
    advertisementBid.advertisementId = adId.toString();
    advertisementBid.amount = BigInt(value.toString().replace(/,/g, ''));
    advertisementBid.timestampInSecond = timeStamp(event.block.block.header.number.toNumber());
    await advertisementBid.save();
}
export async function handleSlotRemainChanged(event: SubstrateEvent): Promise<void> {
    logger.info(`handleSlotRemainChanged handled an event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [id, kol, value] } } = event;
    const advertisementBudget = new AdvertisementBudget(guid());
    advertisementBudget.kolDid = kol.toString();
    advertisementBudget.advertisementId = id.toString();
    advertisementBudget.remain = BigInt(value.toString().replace(/,/g, ''));
    advertisementBudget.timestampInSecond = timeStamp(event.block.block.header.number.toNumber());
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
    logger.info(`handleTokenBought handled an event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [id, account, tokens, currency] } } = event;
    const price = new AssetPrice(guid());
    price.assetId = id.toString();
    price.price = BigInt(tokens.toString().replace(/,/g, '')) / BigInt(currency.toString().replace(/,/g, ''));
    price.timestampInSecond = timeStamp(event.block.block.header.number.toNumber());
    await price.save();
}

export async function handleNftCreated(event: SubstrateEvent): Promise<void> {
    logger.info(`handleNftCreated handled an event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [did, nftId] } } = event;
    Nft.get(nftId.toString()).then(async nft => {
        if (!nft) {
            nft = new Nft(nftId.toString());
        }
        if (event.extrinsic.extrinsic.method.method.indexOf('port') > -1) {
            nft.type = 1;// imported
        } else {
            nft.type = 0;// native
        }
        nft.status = 0;// created
        nft.kolDid = did.toString();
        await nft.save();
    });
}
export async function handleNftMinted(event: SubstrateEvent): Promise<void> {
    logger.info(`handleNftMinted handled an event: ${JSON.stringify(event.toHuman())}`);
    // code is not updated now (block: 492093), use it(9999999999) temporarily
    // we should use chain version instead of block number
    // old
    if (event.block.block.header.number.toNumber() < 504793) {
        const { event: { data: [did, assetId, _, name, symbol, mintedAmount] } } = event;
        const asset = new Asset(assetId.toString());
        asset.ownerDid = did.toString();
        asset.name = name.toHuman().toString();
        asset.symbol = symbol.toHuman().toString();
        asset.amount = BigInt(mintedAmount.toString().replace(/,/g, ''));
        await asset.save();
        const nft = new Nft(guid());
        nft.type = 2;// old asset minted
        nft.status = 1;
        nft.assetId = assetId.toString();
        nft.kolDid = did.toString();
        nft.assetName = name.toHuman().toString();
        nft.assetSymbol = symbol.toHuman().toString();
        nft.assetAmount = BigInt(mintedAmount.toString().replace(/,/g, ''));
        await nft.save();
    }
    else
    // new 
    {
        const { event: { data: [did, nftId, assetId, assetName, assetSymbol, assetAmount] } } = event;
        Nft.get(nftId.toString()).then(async nft => {
            if (nft) {
                nft.kolDid = did.toString();
                nft.status = 1;// minted
                nft.assetId = assetId.toString();
                nft.assetName = assetName.toHuman().toString();
                nft.assetSymbol = assetSymbol.toHuman().toString();
                nft.assetAmount = BigInt(assetAmount.toString().replace(/,/g, ''));
                await nft.save();
            } else {
                const nft = new Nft(nftId.toString());
                nft.type = 0;// native
                nft.status = 1;// minted
                nft.assetId = assetId.toString();
                nft.assetName = assetName.toHuman().toString();
                nft.assetSymbol = assetSymbol.toHuman().toString();
                nft.assetAmount = BigInt(assetAmount.toString().replace(/,/g, ''));
                await nft.save();
            }
        });
    }
}

export async function handleCodeUpdated(event: SubstrateEvent): Promise<void> {
    logger.info(`handleCodeUpdated handled an event: ${JSON.stringify(event.toHuman())}`);
    if (event.block.specVersion === 324) {
        //In upgrade of 323 -> 324, ad.bided's schema transfer from Bid(DidOf<T>, HashOf<T>, BalanceOf<T>) -> Bid(NftOf<T>, HashOf<T>, BalanceOf<T>), 
        //so we need migrate the existing value in db
        //There only exists two kol before this upgrade, so deal with them manually
        //0x33f89db830e20483cd44cf5d906bb4d2da1ab896's prefferredNft is 0
        //0x0c3d48626e46524699f86112035152aa6336bee9's prefferredNft is 7
        let preferredOfDID = new Map([["0x33f89db830e20483cd44cf5d906bb4d2da1ab896", "0"], ["0x0c3d48626e46524699f86112035152aa6336bee9", "7"]]);

        let bids = await AdvertisementBid.getByNftId("0x33f89db830e20483cd44cf5d906bb4d2da1ab896");
        bids = bids.concat(await AdvertisementBid.getByNftId("0x0c3d48626e46524699f86112035152aa6336bee9"));

        for (let bid of bids) {
            if (!preferredOfDID.has(bid.nftId)) {
                logger.info(`preferredOfDID doesnot contains ${stringifyWithBigIntSupport(bid)}`);
                continue;
            }
            logger.info(`got bid as ${stringifyWithBigIntSupport(bid)}, bid.nftId is ${bid.nftId}, preferredOfDID is ${preferredOfDID.get(bid.nftId)} `);
            let oldNftId = bid.nftId;
            bid.nftId = preferredOfDID.get(bid.nftId);
            await bid.save();
            logger.info(`update bid's nftId from ${oldNftId} to ${bid.nftId}`)
        }
    }

    function stringifyWithBigIntSupport(obj: Object) {
        JSON.stringify(
            obj,
            (key, value) =>
                typeof value === 'bigint'
                    ? value.toString()
                    : value // return everything else unchanged
        )
    }
}
