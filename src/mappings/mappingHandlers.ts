import {SubstrateExtrinsic,SubstrateEvent,SubstrateBlock} from "@subql/types";
import {Balance} from "@polkadot/types/interfaces";
import { Did } from "../types/models/Did";
import { Nft } from "../types/models/Nft";
import { AdvertisementReward } from "../types/models/AdvertisementReward";


export async function handleBlock(block: SubstrateBlock): Promise<void> {
    logger.debug("mappingHandler got a block: ", block.block.header.number.toNumber());
}
/**
 * {"phase":{"ApplyExtrinsic":"1"},"event":{"method":"Assigned","section":"did","index":"0x2600","data":["0x12816265b2a84ce366f674995e5c439365712c55","5EYCAe5ijQkVKBy52wmGD3kJnFQ8CmyVD9U2ecNMQFoepQvb",null]},"topics":[]}
 * @param event 
 */
export async function handleDidAssigned(event: SubstrateEvent): Promise<void> {
    logger.info(`mappingHandler got aDidAssigned event: ${JSON.stringify(event.toHuman())}` );  
    const {event: {data: [did, stashAccount]}} = event;
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
    logger.info(`mappingHandler got a NftMinted event: ${JSON.stringify(event.toHuman())}` );  
    const {event: {data: [did, assetId, _, mintedAmount]}} = event;
    const nft = new Nft(assetId.toHuman() as string);
    nft.ownerDidId = did.toHuman() as string;
    await nft.save();
}

export async function handleTimestampSet(extrinsic: SubstrateExtrinsic): Promise<void> {
    logger.debug("mappingHandler got timestamp set call: ", extrinsic);  
}

export async function handleAdPayout(event: SubstrateEvent): Promise<void> {
    logger.info(`handleAdPayout got a Paid event: ${JSON.stringify(event.toHuman())}` );  
    const {event: {data: [id,nft, visitor, reward, referer,award]}} = event;
    const advertisementReward= new AdvertisementReward(id.toString()+reward.toString());
    advertisementReward.reward= Number(reward.toString());
    advertisementReward.award= Number(award.toString());
    advertisementReward.refererId= referer.toString();
    advertisementReward.visitorId= visitor.toString();
    advertisementReward.nftIdId = nft.toString();
    await advertisementReward.save();
}
