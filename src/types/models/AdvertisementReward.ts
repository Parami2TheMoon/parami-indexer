// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';


export class AdvertisementReward implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public advertisementId?: string;

    public nftId: string;

    public visitorDid: string;

    public reward: bigint;

    public refererDid: string;

    public award: bigint;

    public timestampInSecond: number;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save AdvertisementReward entity without an ID");
        await store.set('AdvertisementReward', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove AdvertisementReward entity without an ID");
        await store.remove('AdvertisementReward', id.toString());
    }

    static async get(id:string): Promise<AdvertisementReward | undefined>{
        assert((id !== null && id !== undefined), "Cannot get AdvertisementReward entity without an ID");
        const record = await store.get('AdvertisementReward', id.toString());
        if (record){
            return AdvertisementReward.create(record);
        }else{
            return;
        }
    }


    static async getByAdvertisementId(advertisementId: string): Promise<AdvertisementReward[] | undefined>{
      
      const records = await store.getByField('AdvertisementReward', 'advertisementId', advertisementId);
      return records.map(record => AdvertisementReward.create(record));
      
    }

    static async getByVisitorDid(visitorDid: string): Promise<AdvertisementReward[] | undefined>{
      
      const records = await store.getByField('AdvertisementReward', 'visitorDid', visitorDid);
      return records.map(record => AdvertisementReward.create(record));
      
    }

    static async getByRefererDid(refererDid: string): Promise<AdvertisementReward[] | undefined>{
      
      const records = await store.getByField('AdvertisementReward', 'refererDid', refererDid);
      return records.map(record => AdvertisementReward.create(record));
      
    }


    static create(record: Partial<Omit<AdvertisementReward, FunctionPropertyNames<AdvertisementReward>>> & Entity): AdvertisementReward {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new AdvertisementReward(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
