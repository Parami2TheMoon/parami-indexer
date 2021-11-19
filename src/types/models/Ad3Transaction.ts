// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';


export class Ad3Transaction implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public fromStashAccount: string;

    public toStashAccount: string;

    public amount: bigint;

    public timestampInSecond: number;


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


    static async getByFromStashAccount(fromStashAccount: string): Promise<Ad3Transaction[] | undefined>{
      
      const records = await store.getByField('Ad3Transaction', 'fromStashAccount', fromStashAccount);
      return records.map(record => Ad3Transaction.create(record));
      
    }

    static async getByToStashAccount(toStashAccount: string): Promise<Ad3Transaction[] | undefined>{
      
      const records = await store.getByField('Ad3Transaction', 'toStashAccount', toStashAccount);
      return records.map(record => Ad3Transaction.create(record));
      
    }


    static create(record: Partial<Omit<Ad3Transaction, FunctionPropertyNames<Ad3Transaction>>> & Entity): Ad3Transaction {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Ad3Transaction(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
