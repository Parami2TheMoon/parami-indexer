import { SubstrateExtrinsic, SubstrateEvent, SubstrateBlock } from "@subql/types";
//import { Balance } from "@polkadot/types/interfaces";
import { Nft, Did, AdvertisementReward, Advertisement, Ad3Transaction } from "../types";
import {Balance} from "@polkadot/types/interfaces";
import { AssetTransaction } from "../types";
import { Data } from "@polkadot/types";


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
    const nft = new Nft(assetId.toHuman() as string);
    nft.ownerDidId = did.toHuman() as string;
    await nft.save();
    logger.info(`nft saved success: ${JSON.stringify(nft)}` );  
}

export async function handleAdPayout(event: SubstrateEvent): Promise<void> {
    logger.info(`handleAdPayout got a Paid event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [id, nft, visitor, reward, referer, award] } } = event;
    const advertisementReward = new AdvertisementReward(id.toString() + reward.toString());
    advertisementReward.reward = Number(reward.toString());
    advertisementReward.award = Number(award.toString());
    advertisementReward.refererId = referer.toString();
    advertisementReward.visitorId = visitor.toString();
    advertisementReward.nftIdId = nft.toString();
    advertisementReward.timestampInSecond = Date.now() / 1000;
    await advertisementReward.save();
}

/**
 * 
 * @param event 		data: Issued(T::AssetId, T::AccountId, T::Balance),
 */
export async function handleAssetIssued(event: SubstrateEvent): Promise<void> {
    logger.info(`mappingHandler got a AssetIssued event: ${JSON.stringify(event.toHuman())}` );  
    const {event: {data: [assetId, accountId, balance]}} = event;
    const assetTransaction = new AssetTransaction(new Date().getMilliseconds().toString());
    assetTransaction.didId = accountId.toHuman() as string;
    assetTransaction.amount = BigInt(balance.toString());
    await assetTransaction.save(); 
    logger.info(`AssetTransaction saved success: ${JSON.stringify(assetTransaction)}` );  
}

/**
 * 
 * @param event 		data: 		Transferred(T::AssetId, T::AccountId, T::AccountId, T::Balance)
 */
 export async function handleAssetTransferred(event: SubstrateEvent): Promise<void> {
    logger.info(`mappingHandler got a AssetIssued event: ${JSON.stringify(event.toHuman())}` );  
    const {event: {data: [assetId, fromAccountId, toAccountId, balance]}} = event;
    
    const txnOfFromAccount = new AssetTransaction(new Date().getMilliseconds().toString());
    txnOfFromAccount.nftIdId = assetId.toHuman() as string;
    txnOfFromAccount.didId = fromAccountId.toHuman() as string;
    txnOfFromAccount.amount = BigInt(balance.toString());
    await txnOfFromAccount.save(); 
    logger.info(`AssetTransaction of transfer saved success for from account: ${JSON.stringify(txnOfFromAccount)}`);  

    const txnToAccount = new AssetTransaction(new Date().getMilliseconds().toString());
    txnToAccount.nftIdId = assetId.toHuman() as string;
    txnToAccount.didId = toAccountId.toHuman() as string;
    txnToAccount.amount = BigInt(balance.toString());
    await txnToAccount.save(); 
    logger.info(`AssetTransaction of transfer saved success for to account: ${JSON.stringify(txnToAccount)}`); 
}

/**
 * 
 * @param event 		data: 		Burned(T::AssetId, T::AccountId, T::Balance),
 */
 export async function handleAssetBurned(event: SubstrateEvent): Promise<void> {
    logger.info(`mappingHandler got a AssetBurned event: ${JSON.stringify(event.toHuman())}` );  
    const {event: {data: [assetId, accountId, balance]}} = event;
    const assetTransaction = new AssetTransaction(new Date().getMilliseconds().toString());
    assetTransaction.nftIdId = assetId.toHuman() as string;
    assetTransaction.didId = accountId.toHuman() as string;
    assetTransaction.amount = BigInt(balance.toString());
    await assetTransaction.save(); 
    logger.info(`AssetTransaction for burned saved success: ${JSON.stringify(assetTransaction)}` );  
}

//balance.Transfer
export async function handleAd3Transaction(event: SubstrateEvent): Promise<void> {
    logger.info(`handleAd3Transaction got a Paid event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [from, to, value] } } = event;
    const ad3Transaction = new Ad3Transaction(guid());
    ad3Transaction.fromDidId = from.toString();
    ad3Transaction.toDidId = to.toString();
    ad3Transaction.amount = Number(value.toString());
    ad3Transaction.timestampInSecond = Date.now() / 1000;
    await ad3Transaction.save();
}

//ad.Deposited
export async function handleAdvertisementCreate(event: SubstrateEvent): Promise<void> {
    logger.info(`handleAdvertisement got a Paid event: ${JSON.stringify(event.toHuman())}`);
    const { event: { data: [id, did, value] } } = event;
    const advertisement = new Advertisement(id.toString());
    advertisement.budgetInAd3 = Number(value.toString());
    advertisement.advertiserId = did.toString();
    advertisement.timestampInSecond = Date.now() / 1000;
    await advertisement.save();
}