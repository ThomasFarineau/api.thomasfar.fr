import Koa from 'koa';
import bodyParser from '@koa/bodyparser';
import Router from '@koa/router';
import config from 'config';
import 'reflect-metadata';
import UpdateController from './controllers/UpdateController';
import {CONTROLLER_KEY, MIDDLEWARE_KEY, ROUTES_KEY} from "./decorators";

const app = new Koa();
const router = new Router();
const PORT = config.get<number>('port');

export function registerControllers(controllers: any[], router: Router) {
    controllers.forEach(ControllerClass => {
        const instance = typeof ControllerClass === 'function' ? new ControllerClass() : ControllerClass;
        const prefix: string = Reflect.getMetadata(CONTROLLER_KEY, ControllerClass) || '';
        const routes: any[] = Reflect.getMetadata(ROUTES_KEY, ControllerClass) || [];

        routes.forEach(route => {
            const {method, path, handler} = route;
            const fullPath = prefix + path;

            const middlewares = Reflect.getMetadata(MIDDLEWARE_KEY, instance, handler) || [];

            const handlerFn = instance[handler].bind(instance);

            (router as any)[method](fullPath, ...middlewares, handlerFn);
        });
    });
}

app.use(bodyParser());


registerControllers([UpdateController], router);

app.use(router.routes());
app.use(router.allowedMethods());

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});