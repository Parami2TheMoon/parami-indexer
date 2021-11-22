import { SubstrateExtrinsic, SubstrateEvent, SubstrateBlock } from "@subql/types";
//import { Balance } from "@polkadot/types/interfaces";
import { Asset, Did, AdvertisementReward, Advertisement } from "../types";
import { Balance } from "@polkadot/types/interfaces";
import { AssetTransaction } from "../types";
import { Data } from "@polkadot/types";

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
    return asset.symbol;
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
    asset.name = name.toString();
    asset.symbol = symbol.toString();
    asset.amount = BigInt(mintedAmount.toString().replace(/,/g, ''));
    asset.save();
}

export async function handleAdPayout(event: SubstrateEvent): Promise<void> {
    logger.info(`handleAdPayout got a Paid event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [id, assetId, visitor, reward, referer, award] } } = event;
    const advertisementReward = new AdvertisementReward(id.toString() + reward.toString());
    advertisementReward.reward = BigInt(reward.toString());
    advertisementReward.award = BigInt(award.toString());
    advertisementReward.refererDid = referer.toString();
    advertisementReward.visitorDid = visitor.toString();
    advertisementReward.assetId = assetId.toString();
    advertisementReward.timestampInSecond = Math.floor(Date.now() / 1000);
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
    const tx = new AssetTransaction(guid());
    tx.assetId = assetId.toString();
    tx.assetSymbol = await getSymbol(tx.assetId);

    tx.fromDid = await getDid(fromDid.toString());
    tx.toDid = await getDid(toDid.toString());

    logger.error(`handleAssetTransferred getDid error: ${e.message}`);

    tx.amount = BigInt(balance.toString().replace(/,/g, ''));
    tx.timestampInSecond = Math.floor(Date.now() / 1000);
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
    const assetTransaction = new AssetTransaction(guid());
    assetTransaction.assetId = assetId.toString();

    assetTransaction.fromDid = await getDid(accountId.toString());

    logger.error(`handleAssetBurned getDid error: ${e.message}`);

    assetTransaction.toDid = "black hole";
    assetTransaction.amount = BigInt(balance.toString().replace(/,/g, ''));
    assetTransaction.timestampInSecond = Math.floor(Date.now() / 1000);
    assetTransaction.save().then(() => {
        logger.info(`handleAssetBurned saved success for account: ${JSON.stringify(assetTransaction.fromDid)}`);
    });
}

//balance.Transfer
export async function handleAd3Transaction(event: SubstrateEvent): Promise<void> {
    logger.info(`handleAd3Transaction got a Paid event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [fromDid, toDid, value] } } = event;
    const tx = new AssetTransaction(guid());
    tx.assetId = 'AD3';
    tx.assetSymbol = 'AD3';
    try {
        tx.fromDid = await getDid(fromDid.toString());
        tx.toDid = await getDid(toDid.toString());
    } catch (e) {
        logger.error(`handleAssetTransferred getDid error: ${e.message}`);
        return;
    }
    const valueAfterReplace = value.toHuman().toString().replace(/,/g, '');;
    logger.info(`handleAd3Transaction, got amount = ${valueAfterReplace}`)
    tx.amount = BigInt(valueAfterReplace);
    tx.timestampInSecond = Math.floor(Date.now() / 1000);
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
    advertisement.timestampInSecond = Math.floor(Date.now() / 1000);
    await advertisement.save();
}

