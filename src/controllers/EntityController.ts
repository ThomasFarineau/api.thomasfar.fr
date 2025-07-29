import {Controller, Delete, Get, Post, Put} from "../decorators";
import {ParameterizedContext} from "koa";
import {getDB} from "../db";
import {ObjectId} from "mongodb";
import EntityService from "@services/EntityService";

@Controller('/entity')
export default class EntityController {

    constructor(private entityService = new EntityService()) {
    }

    @Post('/:name') async create(ctx: ParameterizedContext) {
        const {name} = ctx.params;
        try {
            const data = ctx.request.body;
            const model = this.entityService.model(name)
            const instance = new model(data);
            const res = await model.save()

            ctx.body = {_id: result.insertedId, ...data};
        } catch (error) {
            ctx.status = 404;
            return;
        }
    }

    @Delete('/:path/:id') async delete(ctx: ParameterizedContext) {
        const {path, id} = ctx.params;
        const db = await getDB();
        const result = await db.collection(path).deleteOne({_id: new ObjectId(id)});
        ctx.body = {deletedCount: result.deletedCount};
    }

    @Get('/:name') async getAll(ctx: ParameterizedContext) {
        const {name} = ctx.params;
        try {
            ctx.body = await this.entityService.model(name).findAll();
        } catch (error) {
            ctx.status = 404;
        }
    }

    @Get('/:name/:id') async getById(ctx: ParameterizedContext) {
        const {name, id} = ctx.params;
        try {
            const data = await this.entityService.model(name).findById(id);
            if (!data) {
                ctx.status = 404;
                return;
            }
            ctx.body = data;
        } catch (error) {
            ctx.status = 404;
        }
    }

    @Get('') async getModels(ctx: ParameterizedContext) {
        ctx.body = this.entityService.models
    }

    @Put('/:path/:id') async update(ctx: ParameterizedContext) {
        const {path, id} = ctx.params;
        const db = await getDB();
        const result = await db.collection(path).updateOne({_id: new ObjectId(id)}, {$set: ctx.request.body});
        ctx.body = {modifiedCount: result.modifiedCount};
    }
}
