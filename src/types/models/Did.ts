// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';


export class Did implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Did entity without an ID");
        await store.set('Did', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Did entity without an ID");
        await store.remove('Did', id.toString());
    }

    static async get(id:string): Promise<Did | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Did entity without an ID");
        const record = await store.get('Did', id.toString());
        if (record){
            return Did.create(record);
        }else{
            return;
        }
    }



    static create(record: Partial<Omit<Did, FunctionPropertyNames<Did>>> & Entity): Did {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Did(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
