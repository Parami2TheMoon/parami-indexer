// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';


export class AdvertisementReward implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public toDidId: string;

    public advertisementIdId: string;

    public nftIdId: string;

    public rewardType: boolean;

    public amount: number;


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


    static async getByToDidId(toDidId: string): Promise<AdvertisementReward[] | undefined>{
      
      const records = await store.getByField('AdvertisementReward', 'toDidId', toDidId);
      return records.map(record => AdvertisementReward.create(record));
      
    }

    static async getByAdvertisementIdId(advertisementIdId: string): Promise<AdvertisementReward[] | undefined>{
      
      const records = await store.getByField('AdvertisementReward', 'advertisementIdId', advertisementIdId);
      return records.map(record => AdvertisementReward.create(record));
      
    }

    static async getByNftIdId(nftIdId: string): Promise<AdvertisementReward[] | undefined>{
      
      const records = await store.getByField('AdvertisementReward', 'nftIdId', nftIdId);
      return records.map(record => AdvertisementReward.create(record));
      
    }


    static create(record: Partial<Omit<AdvertisementReward, FunctionPropertyNames<AdvertisementReward>>> & Entity): AdvertisementReward {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new AdvertisementReward(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
