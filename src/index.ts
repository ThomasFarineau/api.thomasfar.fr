import "reflect-metadata";

import {ArckServer} from "@helpers/arck-server";
import {OpenAPIService} from "@helpers/openapi/service";
import config from "config";

import AuthController from "./auth/controller";
import DatabaseController from "./controllers/DatabaseController";
import DefaultController from "./controllers/DefaultController";
import UpdateController from "./controllers/UpdateController";

const PORT = config.get<number>("port");

OpenAPIService.getInstance().defaultUI = "scalar"

ArckServer.create(PORT)
  .enableOpenAPI({
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http", scheme: "bearer", bearerFormat: "JWT"
        }
      }
    }
  })
  .addController(DefaultController)
  .addController(AuthController)
  .addControllers([UpdateController, DatabaseController])
  .listen();
