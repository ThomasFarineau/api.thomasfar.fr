import {UpdateService} from "@services/UpdateService";
import {ParameterizedContext} from "koa";
import Controller from "@i/controller.i";

class UpdateController implements Controller {

    constructor(private updateService = new UpdateService()) {
    }

    async updateHandler(ctx: ParameterizedContext) {
        const token = (ctx.request.query.token as string) || (ctx.request.headers['x-update-token'] as string);
        if (!this.updateService.validateToken(token)) {
            ctx.status = 403;
            ctx.body = {error: 'Forbidden'};
            return;
        }

        try {
            if (await this.updateService.isUpToDate()) {
                ctx.body = {upToDate: true};
                return;
            }

            await this.updateService.updateCode();

            ctx.body = {message: 'Restarting'};

            this.updateService.restartApp().catch(err => {
                console.error('PM2 restart failed:', err);
            });
        } catch (err: any) {
            ctx.status = 500;
            ctx.body = {error: err.message};
        }
    }
}

export default new UpdateController();