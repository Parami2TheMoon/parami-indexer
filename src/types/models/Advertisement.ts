// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';


export class Advertisement implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public budgetInAd3: number;

    public advertiserId: string;

    public timestampInSecond: number;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Advertisement entity without an ID");
        await store.set('Advertisement', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Advertisement entity without an ID");
        await store.remove('Advertisement', id.toString());
    }

    static async get(id:string): Promise<Advertisement | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Advertisement entity without an ID");
        const record = await store.get('Advertisement', id.toString());
        if (record){
            return Advertisement.create(record);
        }else{
            return;
        }
    }


    static async getByAdvertiserId(advertiserId: string): Promise<Advertisement[] | undefined>{
      
      const records = await store.getByField('Advertisement', 'advertiserId', advertiserId);
      return records.map(record => Advertisement.create(record));
      
    }


    static create(record: Partial<Omit<Advertisement, FunctionPropertyNames<Advertisement>>> & Entity): Advertisement {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Advertisement(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
