import "reflect-metadata";

import { ArckServer } from "@helpers/arck-server";
import config from "config";

import Controller from "./auth/controller";
import DatabaseController from "./controllers/DatabaseController";
import DefaultController from "./controllers/DefaultController";
import UpdateController from "./controllers/UpdateController";

const PORT = config.get<number>("port");

ArckServer.create(PORT)
  .enableOpenAPI({
    "components": {
      "securitySchemes": {
        "bearerAuth": {
          "type": "http",
          "scheme": "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  })
  .addController(DefaultController)
  .addController(Controller)
  .addControllers([UpdateController, DatabaseController])
  .listen();
