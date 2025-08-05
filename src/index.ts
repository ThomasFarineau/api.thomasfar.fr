import config from 'config';
import 'reflect-metadata';
import UpdateController from './controllers/UpdateController';
import EntityController from "./controllers/EntityController";
import DatabaseController from "./controllers/DatabaseController";
import DefaultController from "./controllers/DefaultController";
import {ArckServer} from "@helpers/arck-server";

const PORT = config.get<number>('port');

ArckServer
    .create(PORT)
    .enableOpenAPI()
    .addController(DefaultController)
    .addControllers([UpdateController, EntityController, DatabaseController])
    .listen()