// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';


export class AssetTransaction implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public didId: string;

    public nftIdId?: string;

    public timestampInSecond: number;

    public amount: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save AssetTransaction entity without an ID");
        await store.set('AssetTransaction', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove AssetTransaction entity without an ID");
        await store.remove('AssetTransaction', id.toString());
    }

    static async get(id:string): Promise<AssetTransaction | undefined>{
        assert((id !== null && id !== undefined), "Cannot get AssetTransaction entity without an ID");
        const record = await store.get('AssetTransaction', id.toString());
        if (record){
            return AssetTransaction.create(record);
        }else{
            return;
        }
    }


    static async getByDidId(didId: string): Promise<AssetTransaction[] | undefined>{
      
      const records = await store.getByField('AssetTransaction', 'didId', didId);
      return records.map(record => AssetTransaction.create(record));
      
    }

    static async getByNftIdId(nftIdId: string): Promise<AssetTransaction[] | undefined>{
      
      const records = await store.getByField('AssetTransaction', 'nftIdId', nftIdId);
      return records.map(record => AssetTransaction.create(record));
      
    }


    static create(record: Partial<Omit<AssetTransaction, FunctionPropertyNames<AssetTransaction>>> & Entity): AssetTransaction {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new AssetTransaction(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
