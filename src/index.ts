import config from "config";
import "reflect-metadata";
import UpdateController from "./controllers/UpdateController";
import DatabaseController from "./controllers/DatabaseController";
import DefaultController from "./controllers/DefaultController";
import { ArckServer } from "@helpers/arck-server";
import Controller from "./auth/controller";

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
