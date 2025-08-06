import nodePackage from "../../package.json";
import { Controller, Get } from "../decorators";

@Controller("")
export default class DefaultController {
  @Get("/")
  public async index(ctx: any): Promise<void> {
    ctx.body = {
      name: nodePackage.name,
      version: nodePackage.version,
      description: nodePackage.description
    };
  }
}
