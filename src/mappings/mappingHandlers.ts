import {SubstrateExtrinsic,SubstrateEvent,SubstrateBlock} from "@subql/types";
import {Balance} from "@polkadot/types/interfaces";
import { Did } from "../types/models/Did";


export async function handleBlock(block: SubstrateBlock): Promise<void> {
    logger.debug("mappingHandler got a block: ", block.block.header.number.toNumber());
}
/**
 * //{"phase":{"ApplyExtrinsic":"1"},"event":{"method":"Assigned","section":"did","index":"0x2600","data":["0x12816265b2a84ce366f674995e5c439365712c55","5EYCAe5ijQkVKBy52wmGD3kJnFQ8CmyVD9U2ecNMQFoepQvb",null]},"topics":[]}
 * @param event 
 */
export async function handleDidAssigned(event: SubstrateEvent): Promise<void> {
    logger.info(`mappingHandler got aDidAssigned event: ${JSON.stringify(event.toHuman())}` );  
    const {event: {data: [did, stashAccount]}} = event;
    const record = new Did(did.toHuman() as string);
    await record.save();
}

export async function handleTimestampSet(extrinsic: SubstrateExtrinsic): Promise<void> {
    logger.debug("mappingHandler got timestamp set call: ", extrinsic);  
}


