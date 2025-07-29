import {Controller, Get} from "../decorators";
import {ParameterizedContext} from "koa";

@Controller('/entity')
export default class EntityController {


    @Get('/:name') async getAllEntities(ctx: ParameterizedContext) {
        ctx.body = {
            message: `Get all entities for ${ctx.params.name}`,
            params: ctx.params,
            query: ctx.query,
            headers: ctx.headers,
        }
    }
}
