import { SubstrateExtrinsic, SubstrateEvent, SubstrateBlock } from "@subql/types";
//import { Balance } from "@polkadot/types/interfaces";
import { Nft, Did, AdvertisementReward, Advertisement, Ad3Transaction } from "../types";
import {Balance} from "@polkadot/types/interfaces";
import { AssetTransaction } from "../types";
import { Data } from "@polkadot/types";

function replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
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
    logger.info(`mappingHandler got aDidAssigned event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [did, stashAccount] } } = event;
    const record = new Did(did.toHuman() as string);
    record.stashAccount = stashAccount.toString();
    await record.save();
}

/**
 * 
 * @param event event: {"phase":{"ApplyExtrinsic":"1"},"event":{"method":"Backed","section":"nft","index":"0x2900","data":["0x377e68a483a3db3b23bca8d38bed464684354da0","0xa83486388d5776f8adeb739d97c75e9780209ce0","1,000,000,000,000,000,000,000"]},"topics":[]}
 * 
 * data format:         Minted(T::DecentralizedId, T::AssetId, T::AssetId, BalanceOf<T>)
 */
export async function handleNftMinted(event: SubstrateEvent): Promise<void> {
    logger.info(`mappingHandler got a NftMinted event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [did, assetId, _, mintedAmount] } } = event;
    const nft = new Nft(assetId.toString());
    nft.ownerDid = did.toString();
    await nft.save();
    logger.info(`nft saved success: ${JSON.stringify(nft)}` );  
}

export async function handleAdPayout(event: SubstrateEvent): Promise<void> {
    logger.info(`handleAdPayout got a Paid event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [id, nft, visitor, reward, referer, award] } } = event;
    const advertisementReward = new AdvertisementReward(id.toString() + reward.toString());
    advertisementReward.reward = BigInt(reward.toString());
    advertisementReward.award = BigInt(award.toString());
    advertisementReward.refererDid = referer.toString();
    advertisementReward.visitorDid = visitor.toString();
    advertisementReward.nftId = nft.toString();
    advertisementReward.timestampInSecond = Math.floor(Date.now() / 1000);
    await advertisementReward.save();
}

/**
 * 
 * @param event 		data: 		Transferred(T::AssetId, T::AccountId, T::AccountId, T::Balance)
 */
 export async function handleAssetTransferred(event: SubstrateEvent): Promise<void> {
    logger.info(`handleAssetTransferred got event: ${JSON.stringify(event.toHuman())}` );  
    const {event: {data: [assetId, fromAccountId, toAccountId, balance]}} = event;
    
    const txnOfFromAccount = new AssetTransaction(guid());
    txnOfFromAccount.nftId = assetId.toString();
    txnOfFromAccount.stashAccount = fromAccountId.toString();
    txnOfFromAccount.amount = BigInt(balance.toString().replace(/,/g,''));
    txnOfFromAccount.timestampInSecond = Math.floor(Date.now() / 1000);
    await txnOfFromAccount.save(); 
    logger.info(`handleAssetTransferred saved success for from account: ${JSON.stringify(txnOfFromAccount.stashAccount)}`);  

    const txnToAccount = new AssetTransaction(guid());
    txnToAccount.nftId = assetId.toString();
    txnToAccount.stashAccount = toAccountId.toString();
    txnToAccount.amount = BigInt(balance.toString().replace(/,/g,''));
    txnToAccount.timestampInSecond = Math.floor(Date.now() / 1000);
    await txnToAccount.save(); 
    logger.info(`handleAssetTransferred saved success for to account: ${JSON.stringify(txnToAccount.stashAccount)}`); 
}

/**
 * 
 * @param event 		data: 		Burned(T::AssetId, T::AccountId, T::Balance),
 */
 export async function handleAssetBurned(event: SubstrateEvent): Promise<void> {
    logger.info(`mappingHandler got a AssetBurned event: ${JSON.stringify(event.toHuman())}` );  
    const {event: {data: [assetId, accountId, balance]}} = event;
    const assetTransaction = new AssetTransaction(guid());
    assetTransaction.nftId = assetId.toString();
    assetTransaction.stashAccount = accountId.toString();
    assetTransaction.amount = BigInt(balance.toString().replace(/,/g,''));
    assetTransaction.timestampInSecond = Math.floor(Date.now() / 1000);
    await assetTransaction.save(); 
    logger.info(`AssetTransaction for burned saved success: ${JSON.stringify(assetTransaction)}` );  
}

//balance.Transfer
export async function handleAd3Transaction(event: SubstrateEvent): Promise<void> {
    logger.info(`handleAd3Transaction got a Paid event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [from, to, value] } } = event;
    const ad3Transaction = new Ad3Transaction(guid());
    ad3Transaction.fromStashAccount = from.toString();
    ad3Transaction.toStashAccount = to.toString();
    const valueAfterReplace = value.toHuman().toString().replace(/,/g,'');;
    logger.info(`handleAd3Transaction, got amount = ${valueAfterReplace}`)
    ad3Transaction.amount = BigInt(valueAfterReplace);
    ad3Transaction.timestampInSecond = Math.floor(Date.now() / 1000);
    await ad3Transaction.save();
}

//ad.Deposited
export async function handleAdvertisementCreate(event: SubstrateEvent): Promise<void> {
    logger.info(`handleAdvertisement got a Paid event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [id, did, value] } } = event;
    const advertisement = new Advertisement(id.toString());
    advertisement.budgetInAd3 = BigInt(value.toString().replace(/,/g,''));
    advertisement.advertiserId = did.toString();
    advertisement.timestampInSecond = Math.floor(Date.now() / 1000);
    await advertisement.save();
}

