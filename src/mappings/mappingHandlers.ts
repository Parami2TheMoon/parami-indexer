import { SubstrateExtrinsic, SubstrateEvent, SubstrateBlock } from "@subql/types";
//import { Balance } from "@polkadot/types/interfaces";
import { Asset, Did, AdvertisementReward, Advertisement, AdvertisementBudget, AdvertisementBid, Member } from "../types";
import { Balance } from "@polkadot/types/interfaces";
import { AssetTransaction } from "../types";
import { Data } from "@polkadot/types";

const ChainStartTimeStamp = 1638370302;

function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

async function getDid(stashAccount: string) {
    const did = await Did.getByStashAccount(stashAccount);
    if (did.length === 0) {
        return stashAccount;
    }
    return did[0].id;
}
async function getSymbol(assetId: string) {
    const asset = await Asset.get(assetId);
    if (!asset?.symbol) return '';
    return asset.symbol;
}
async function getOwnerDid(assetId: string) {
    const asset = await Asset.get(assetId);
    return asset.ownerDid;
}
export async function handleBlock(block: SubstrateBlock): Promise<void> {
    logger.debug("mappingHandler got a block: ", block.block.header.number.toNumber());
}
/**
 * {"phase":{"ApplyExtrinsic":"1"},"event":{"method":"Assigned","section":"did","index":"0x2600","data":["0x12816265b2a84ce366f674995e5c439365712c55","5EYCAe5ijQkVKBy52wmGD3kJnFQ8CmyVD9U2ecNMQFoepQvb",null]},"topics":[]}
 * @param event 
 */
export async function handleDidAssigned(event: SubstrateEvent): Promise<void> {
    logger.info(`mappingHandler got aDidAssigned event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [did, stashAccount] } } = event;
    const record = new Did(did.toHuman() as string);
    record.stashAccount = stashAccount.toString();
    record.save();
}

/**
 * 
 * @param event event: {"phase":{"ApplyExtrinsic":"1"},"event":{"method":"Backed","section":"Asset","index":"0x2900","data":["0x377e68a483a3db3b23bca8d38bed464684354da0","0xa83486388d5776f8adeb739d97c75e9780209ce0","1,000,000,000,000,000,000,000"]},"topics":[]}
 * 
 * data format:         Minted(T::DecentralizedId, T::AssetId, T::AssetId, BalanceOf<T>)
 */
export async function handleNftMinted(event: SubstrateEvent): Promise<void> {
    logger.info(`mappingHandler got a AssetMinted event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [did, assetId, _, name, symbol, mintedAmount] } } = event;
    const asset = new Asset(assetId.toString());
    asset.ownerDid = did.toString();
    asset.name = name.toHuman().toString();
    asset.symbol = symbol.toHuman().toString();
    asset.amount = BigInt(mintedAmount.toString().replace(/,/g, ''));
    asset.save();
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
    advertisementReward.timestampInSecond = Math.floor(ChainStartTimeStamp + event.block.block.header.number.toNumber() * 6);
    advertisementReward.save().then(() => {
        logger.info(`handleAssetTransferred saved success for from account: ${JSON.stringify(advertisementReward.visitorDid)}`);
    });
}

/**
 * 
 * @param event 		data: 		Transferred(T::AssetId, T::AccountId, T::AccountId, T::Balance)
 */
export async function handleAssetTransferred(event: SubstrateEvent): Promise<void> {
    logger.info(`handleAssetTransferred got event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [assetId, fromDid, toDid, balance] } } = event;
    const member = new Member(toDid.toString() + '.' + assetId.toString());
    member.assetId = assetId.toString();
    member.save();
    const tx = new AssetTransaction(guid());
    tx.assetId = assetId.toString();
    tx.assetSymbol = await getSymbol(tx.assetId);
    tx.block = event.block.block.hash.toString();
    tx.fromDid = await getDid(fromDid.toString());
    tx.toDid = await getDid(toDid.toString());
    tx.amount = BigInt(balance.toString().replace(/,/g, ''));
    tx.timestampInSecond = Math.floor(ChainStartTimeStamp + event.block.block.header.number.toNumber() * 6);
    tx.save().then(() => {
        logger.info(`handleAssetTransferred saved success for from account: ${JSON.stringify(tx.fromDid)}`);
    });
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
    tx.assetSymbol = await getSymbol(tx.assetId);
    tx.fromDid = await getDid(accountId.toString());
    tx.block = event.block.block.hash.toString();
    tx.toDid = "burned";
    tx.amount = BigInt(balance.toString().replace(/,/g, ''));
    tx.timestampInSecond = Math.floor(ChainStartTimeStamp + event.block.block.header.number.toNumber() * 6);
    tx.save().then(() => {
        logger.info(`handleAssetBurned saved success for account: ${JSON.stringify(tx.fromDid)}`);
    });
}

//balance.Transfer
export async function handleAd3Transaction(event: SubstrateEvent): Promise<void> {
    logger.info(`handleAd3Transaction got a Paid event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [fromDid, toDid, value] } } = event;
    const tx = new AssetTransaction(guid());
    tx.assetId = 'AD3';
    tx.assetSymbol = 'AD3';
    tx.block = event.block.block.hash.toString();
    tx.fromDid = await getDid(fromDid.toString());
    tx.toDid = await getDid(toDid.toString());

    const valueAfterReplace = value.toHuman().toString().replace(/,/g, '');;
    logger.info(`handleAd3Transaction, got amount = ${valueAfterReplace}`)
    tx.amount = BigInt(valueAfterReplace);
    tx.timestampInSecond = Math.floor(ChainStartTimeStamp + event.block.block.header.number.toNumber() * 6);
    tx.save().then(() => {
        logger.info(`handleAd3Transaction saved success for from account: ${JSON.stringify(tx.fromDid)}`);
    });
}

//ad.Deposited
export async function handleAdvertisementCreate(event: SubstrateEvent): Promise<void> {
    logger.info(`handleAdvertisement got a Paid event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [id, did, value] } } = event;
    const advertisement = new Advertisement(id.toString());
    advertisement.budgetInAd3 = BigInt(value.toString().replace(/,/g, ''));
    advertisement.advertiserId = did.toString();
    advertisement.timestampInSecond = Math.floor(ChainStartTimeStamp + event.block.block.header.number.toNumber() * 6);
    advertisement.save();
}
export async function handleAdvertisementBid(event: SubstrateEvent): Promise<void> {
    const { event: { data: [kol, id, value] } } = event;
    const advertisementBid = new AdvertisementBid(guid());
    advertisementBid.kolDid = kol.toString();
    advertisementBid.advertisementId = id.toString();
    advertisementBid.amount = BigInt(value.toString().replace(/,/g, ''));
    advertisementBid.timestampInSecond = Math.floor(ChainStartTimeStamp + event.block.block.header.number.toNumber() * 6);
    await advertisementBid.save().then(() => {
        logger.info(`handleAdvertisementBid handled a bid event: ${JSON.stringify(event.toHuman())}`);
    });
}
export async function handleSlotRemainChanged(event: SubstrateEvent): Promise<void> {
    const { event: { data: [id, kol, value] } } = event;
    const advertisementBudget = new AdvertisementBudget(guid());
    advertisementBudget.kolDid = kol.toString();
    advertisementBudget.advertisementId = id.toString();
    advertisementBudget.remain = BigInt(value.toString().replace(/,/g, ''));
    advertisementBudget.timestampInSecond = Math.floor(ChainStartTimeStamp + event.block.block.header.number.toNumber() * 6);
    await advertisementBudget.save().then(() => {
        logger.info(`handleSlotRemainChanged handled a bid event: ${JSON.stringify(event.toHuman())}`);
    });
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
