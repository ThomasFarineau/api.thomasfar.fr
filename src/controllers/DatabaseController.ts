import { Spec } from "@helpers/decorators/OpenAPI";
import { DatabaseService } from "@services/DatabaseService";
import { ParameterizedContext } from "koa";

import {authMiddleware} from "../auth/middleware";
import {Controller, Get, Use} from "../decorators";

@Controller("/database")
@Spec({
  name: "Database",
  description: "Database health and status checks"
})
export default class DatabaseController {
  @Get("/health")
  @Use(authMiddleware)
  @Spec({
    name: "Get Database Health",
    description: "Check if the database connection is healthy",
    security: [
      {
        bearerAuth: []
      }
    ]
  })
  public async health(ctx: ParameterizedContext): Promise<void> {
    const isOk = await DatabaseService.verifyConnection();
    if (!isOk) {
      ctx.status = 503;
      ctx.body = {
        error: "Database connection failed"
      };
      return;
    }
    ctx.body = {
      message: "Database is healthy"
    };
  }

  @Get("/info")
  @Use(authMiddleware)
  @Spec({
    name: "Get Database Info",
    description: "Retrieve information about the database status",
    security: [
      {
        bearerAuth: []
      }
    ]
  })
  public async info(ctx: ParameterizedContext): Promise<void> {
    const status = await DatabaseService.getStatus();
    if (!status.ok) {
      ctx.status = 503;
      ctx.body = {
        error: "Database unavailable"
      };
      return;
    }
    ctx.body = {
      message: "Database status",
      version: status.version,
      dbName: status.dbName
    };
  }
}
