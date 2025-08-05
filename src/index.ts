import Koa from 'koa';
import bodyParser from '@koa/bodyparser';
import Router from '@koa/router';
import config from 'config';
import 'reflect-metadata';
import UpdateController from './controllers/UpdateController';
import {CONTROLLER_KEY, MIDDLEWARE_KEY, ROUTES_KEY} from "./decorators";
import EntityController from "./controllers/EntityController";
import DatabaseController from "./controllers/DatabaseController";
import DefaultController from "./controllers/DefaultController";
import DocsController from "./controllers/DocsController";
import {OpenAPI} from "@helpers/OpenAPI";
import {getSpec} from "@helpers/decorators/Spec";
import {ArckServer} from "@helpers/arck-server";

const app = new Koa();
const router = new Router();
const PORT = config.get<number>('port');

function extractPathParametersFromColonPath(path: string) {
    const matches = Array.from(path.matchAll(/:([a-zA-Z0-9_]+)/g));
    return matches.map(match => ({
        name: match[1],
        in: "path",
        required: true,
        schema: { type: "string" }
    }));
}

function convertColonPathToOpenAPI(path: string) {
    // Remplace tous les :param par {param}
    return path.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
}

function registerControllers(controllers: any[], router: Router) {
    controllers.forEach(ControllerClass => {
        const instance = typeof ControllerClass === 'function' ? new ControllerClass() : ControllerClass;
        const prefix: string = Reflect.getMetadata(CONTROLLER_KEY, ControllerClass) || '';
        const routes: any[] = Reflect.getMetadata(ROUTES_KEY, ControllerClass) || [];
        const controllerSpec = getSpec(ControllerClass) || {};

        OpenAPI.getInstance().addTag({
            name: ControllerClass.name,
            "x-displayName": controllerSpec.name,
            description: controllerSpec.description || `Controller for ${ControllerClass.name}`,
        })

        routes.forEach(route => {
            const {method, path, handler} = route;
            const fullPath = prefix + path;
            const methodSpec = getSpec(instance, handler) || {};

            const openApiPath = convertColonPathToOpenAPI(fullPath);

            const parameters = extractPathParametersFromColonPath(fullPath);

            OpenAPI.getInstance().addRoute(openApiPath, method, {
                tags: [ControllerClass.name],
                summary: methodSpec.name || method,
                description: methodSpec.description,
                parameters: parameters.length > 0 ? parameters : undefined,
            })

            const middlewares = Reflect.getMetadata(MIDDLEWARE_KEY, instance, handler) || [];

            const handlerFn = instance[handler].bind(instance);

            (router as any)[method](fullPath, ...middlewares, handlerFn);
        });
    });
}


app.use(bodyParser());


registerControllers([UpdateController, EntityController, DatabaseController, DefaultController, DocsController], router);


app.use(router.routes());
app.use(router.allowedMethods());

// Démarrage du serveur
app.listen(PORT, () => {
});

ArckServer
    .create(PORT)
    .addControllers([UpdateController, EntityController, DatabaseController, DefaultController, DocsController])
    .listen()