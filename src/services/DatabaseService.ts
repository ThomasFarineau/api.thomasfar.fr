import { connectToDB } from "@helpers/db";

export class DatabaseService {
  public static async verifyConnection(): Promise<boolean> {
    try {
      const db = await connectToDB();
      await db.command({
        ping: 1
      });
      return true;
    } catch (_e) {
      return false;
    }
  }

  public static async getStatus(): Promise<{
    ok: boolean;
    version?: string;
    dbName?: string;
  }> {
    try {
      const db = await connectToDB();
      const buildInfo = await db.command({
        buildInfo: 1
      });
      return {
        ok: true,
        version: buildInfo.version,
        dbName: db.databaseName
      };
    } catch {
      return {
        ok: false
      };
    }
  }
}
