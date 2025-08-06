import config from "config";
import { MongoClient } from "mongodb";

const mongo = config.get<{
  uri: string;
  dbName: string;
}>("mongo");

const client = new MongoClient(mongo.uri);

let dbInstance: ReturnType<MongoClient["db"]> | null = null;

export async function connectToDB(): Promise<ReturnType<MongoClient["db"]>> {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db(mongo.dbName);
  }
  return dbInstance;
}
