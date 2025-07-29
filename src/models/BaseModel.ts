import {ObjectId} from "mongodb";
import {getDB} from "../db";

export class BaseModel {
    static collectionName: string;
    _id?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(data?: Partial<BaseModel>) {
        Object.assign(this, data);
        if (!this.createdAt) this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    static async ensureCollection() {
        const db = await getDB();
        const collections = await db.listCollections({}, { nameOnly: true }).toArray();
        const exists = collections.some(c => c.name === (this as any).collectionName);
        if (!exists) {
            await db.createCollection((this as any).collectionName);
        }
    }

    static async findAll() {
        const db = await getDB();
        return db.collection((this as any).collectionName).find({}).toArray();
    }

    static async findById(id: string) {
        const db = await getDB();
        return db.collection((this as any).collectionName).findOne({_id: new ObjectId(id)});
    }

    async save() {
        const db = await getDB();
        if (!this._id) {
            const result = await db.collection((this.constructor as typeof BaseModel).collectionName).insertOne(this);
            this._id = result.insertedId;
        } else {
            await db.collection((this.constructor as typeof BaseModel).collectionName).updateOne(
                {_id: this._id},
                {$set: {...this, updatedAt: new Date()}}
            );
        }
        return this;
    }
}
