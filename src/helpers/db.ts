import { MongoClient } from "mongodb";
import config from "config";

const mongo = config.get<{
  uri: string;
  dbName: string;
}>("mongo");

const client = new MongoClient(mongo.uri);

let dbInstance: ReturnType<MongoClient["db"]> | null = null;

export async function connectToDB() {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db(mongo.dbName);
  }
  return dbInstance;
}
