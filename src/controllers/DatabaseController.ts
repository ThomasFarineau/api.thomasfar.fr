import {Controller, Get, Use} from "../decorators";
import { ParameterizedContext } from "koa";
import { DatabaseService } from "@services/DatabaseService";
import { Spec } from "@helpers/decorators/OpenAPI";
import {authMiddleware} from "../auth/middleware";

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
  async health(ctx: ParameterizedContext) {
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
  async info(ctx: ParameterizedContext) {
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
