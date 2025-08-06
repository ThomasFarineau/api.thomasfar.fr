import UpdateService from "@services/UpdateService";
import { ParameterizedContext } from "koa";

import { Controller, Get, Post } from "../decorators";

@Controller("/update")
export default class UpdateController {
  constructor(private updateService = new UpdateService()) {}

  @Get("")
  public async checkUpdateHandler(ctx: ParameterizedContext): Promise<void> {
    try {
      const isUpToDate = await this.updateService.isUpToDate();
      ctx.body = {
        upToDate: isUpToDate
      };
    } catch (err: any) {
      ctx.status = 500;
      ctx.body = {
        error: err.message
      };
    }
  }

  @Post("")
  public async updateHandler(ctx: ParameterizedContext): Promise<void> {
    const token =
      (ctx.request.query.token as string) ||
      (ctx.request.headers["x-update-token"] as string);
    if (!this.updateService.validateToken(token)) {
      ctx.status = 403;
      ctx.body = {
        error: "Forbidden"
      };
      return;
    }

    try {
      if (await this.updateService.isUpToDate()) {
        ctx.body = {
          upToDate: true
        };
        return;
      }

      await this.updateService.updateCode();

      ctx.body = {
        message: "Restarting"
      };

      this.updateService.restartApp().catch((err) => {
        console.error("PM2 restart failed:", err);
      });
    } catch (err: any) {
      ctx.status = 500;
      ctx.body = {
        error: err.message
      };
    }
  }
}
