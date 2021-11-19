import {SubstrateExtrinsic,SubstrateEvent,SubstrateBlock} from "@subql/types";
import {Balance} from "@polkadot/types/interfaces";
import { Did } from "../types/models/Did";


export async function handleBlock(block: SubstrateBlock): Promise<void> {
    logger.debug("mappingHandler got a block: ", block.block.header.number.toNumber());
}

export async function handleDidAssigned(event: SubstrateEvent): Promise<void> {
    // const {event: {data: [account, balance]}} = event;
    // const record = await Did.get(event['Di']);
    // await record.save();
    logger.info("mappingHandler got aDidAssigned event: ", event);  
}

export async function handleTimestampSet(extrinsic: SubstrateExtrinsic): Promise<void> {
    logger.debug("mappingHandler got timestamp set call: ", extrinsic);  
}


