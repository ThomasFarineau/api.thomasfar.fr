import { makeLogger } from "@helpers/logger";

import OpenAPIController from "./openapi/controller";
import { OpenAPIService, SetupConfig } from "@helpers/openapi/service";
import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "@koa/bodyparser";
import { CONTROLLER_KEY, MIDDLEWARE_KEY, ROUTES_KEY } from "../decorators";
import {ApiResponse, getSpec} from "@helpers/decorators/OpenAPI";
import _ from "lodash";

export class ArckServer {
  logger;

  private useOpenAPI: boolean = false;

  private app: Koa;

  private router: Router;

  constructor(
    private port: number,
    private host: string
  ) {
    this.logger = makeLogger("SERVER");

    this.logger.info(`ArckServer initialized on ${host}:${port}`);
    this.app = new Koa();
    this.router = new Router();

    this.app.use(bodyParser());
  }

  static create(port: number, host: string = "localhost"): ArckServer {
    return new ArckServer(port, host);
  }

  enableOpenAPI(config: SetupConfig = {}): ArckServer {
    this.useOpenAPI = true;
    this.logger.info("OpenAPI enabled.");

    OpenAPIService.getInstance().setup(config);
    this.addController(OpenAPIController);

    return this;
  }

  addController(ControllerClass: any): ArckServer {
    const instance =
      typeof ControllerClass === "function"
        ? new ControllerClass()
        : ControllerClass;
    const prefix: string =
      Reflect.getMetadata(CONTROLLER_KEY, ControllerClass) || "";
    const routes: any[] =
      Reflect.getMetadata(ROUTES_KEY, ControllerClass) || [];

    if (this.useOpenAPI) {
      const controllerSpec = getSpec(ControllerClass) || {};

      OpenAPIService.getInstance().addTag({
        name: ControllerClass.name,
        "x-displayName": controllerSpec.name,
        title: controllerSpec.name,
        description:
          controllerSpec.description ||
          `Controller for ${ControllerClass.name}`
      });
    }

    routes.forEach((route) => {
      const { method, path, handler } = route;
      const fullPath = prefix + path;
      const methodSpec = getSpec(instance, handler) || {};

      if (this.useOpenAPI) {
        const openApiPath = convertColonPathToOpenAPI(fullPath);

        const parameters = extractPathParametersFromColonPath(fullPath);
        if (!methodSpec.hidden) {
          OpenAPIService.getInstance().addRoute(openApiPath, method, {
            tags: [ControllerClass.name],
            summary: methodSpec.name || method,
            description: methodSpec.description,
            parameters: parameters.length > 0 ? parameters : undefined,
            responses: _.reduce(
              methodSpec.responses,
              (acc: any, response: ApiResponse) => {
                acc[response.status] = response;
                return acc;
              },
              {}
            )
          });
        }
      }

      const middlewares =
        Reflect.getMetadata(MIDDLEWARE_KEY, instance, handler) || [];

      const handlerFn = instance[handler].bind(instance);

      (this.router as any)[method](fullPath, ...middlewares, handlerFn);
    });

    this.logger.info(`Controller ${ControllerClass.name} added.`);
    return this;
  }

  addControllers(controllers: any[]): ArckServer {
    controllers.forEach((controller) => {
      this.addController(controller);
    });
    return this;
  }

  listen(): void {
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
    this.app.listen(this.port, () => {
      this.logger.info(`Server running on http://${this.host}:${this.port}`);
    });
  }
}

function extractPathParametersFromColonPath(path: string) {
  const matches = Array.from(path.matchAll(/:([a-zA-Z0-9_]+)/g));
  return matches.map((match) => ({
    name: match[1],
    in: "path",
    required: true,
    schema: {
      type: "string"
    }
  }));
}

function convertColonPathToOpenAPI(path: string) {
  return path.replace(/:([a-zA-Z0-9_]+)/g, "{$1}");
}
