// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';


export class NftCurAdvertisement implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public nftId: string;

    public advertisementId: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save NftCurAdvertisement entity without an ID");
        await store.set('NftCurAdvertisement', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NftCurAdvertisement entity without an ID");
        await store.remove('NftCurAdvertisement', id.toString());
    }

    static async get(id:string): Promise<NftCurAdvertisement | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NftCurAdvertisement entity without an ID");
        const record = await store.get('NftCurAdvertisement', id.toString());
        if (record){
            return NftCurAdvertisement.create(record);
        }else{
            return;
        }
    }


    static async getByNftId(nftId: string): Promise<NftCurAdvertisement[] | undefined>{
      
      const records = await store.getByField('NftCurAdvertisement', 'nftId', nftId);
      return records.map(record => NftCurAdvertisement.create(record));
      
    }

    static async getByAdvertisementId(advertisementId: string): Promise<NftCurAdvertisement[] | undefined>{
      
      const records = await store.getByField('NftCurAdvertisement', 'advertisementId', advertisementId);
      return records.map(record => NftCurAdvertisement.create(record));
      
    }


    static create(record: Partial<Omit<NftCurAdvertisement, FunctionPropertyNames<NftCurAdvertisement>>> & Entity): NftCurAdvertisement {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new NftCurAdvertisement(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
