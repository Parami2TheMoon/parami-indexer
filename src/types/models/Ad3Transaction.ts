// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';


export class Ad3Transaction implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public fromDidId: string;

    public toDidId: string;

    public amount: number;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Ad3Transaction entity without an ID");
        await store.set('Ad3Transaction', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Ad3Transaction entity without an ID");
        await store.remove('Ad3Transaction', id.toString());
    }

    static async get(id:string): Promise<Ad3Transaction | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Ad3Transaction entity without an ID");
        const record = await store.get('Ad3Transaction', id.toString());
        if (record){
            return Ad3Transaction.create(record);
        }else{
            return;
        }
    }


    static async getByFromDidId(fromDidId: string): Promise<Ad3Transaction[] | undefined>{
      
      const records = await store.getByField('Ad3Transaction', 'fromDidId', fromDidId);
      return records.map(record => Ad3Transaction.create(record));
      
    }

    static async getByToDidId(toDidId: string): Promise<Ad3Transaction[] | undefined>{
      
      const records = await store.getByField('Ad3Transaction', 'toDidId', toDidId);
      return records.map(record => Ad3Transaction.create(record));
      
    }


    static create(record: Partial<Omit<Ad3Transaction, FunctionPropertyNames<Ad3Transaction>>> & Entity): Ad3Transaction {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Ad3Transaction(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
