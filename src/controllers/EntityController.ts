import { ParameterizedContext } from "koa";

import { Controller, Get } from "../decorators";

@Controller("/entity")
export default class EntityController {
  @Get("/:name")
  public async getAllEntities(ctx: ParameterizedContext): Promise<void> {
    ctx.body = {
      message: `Get all entities for ${ctx.params.name}`,
      params: ctx.params,
      query: ctx.query,
      headers: ctx.headers
    };
  }
}
