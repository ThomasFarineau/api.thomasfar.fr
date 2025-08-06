import { Controller, Get } from "../decorators";
import nodePackage from "../../package.json";

@Controller("")
export default class DefaultController {
  @Get("/")
  async index(ctx: any) {
    ctx.body = {
      name: nodePackage.name,
      version: nodePackage.version,
      description: nodePackage.description
    };
  }
}
