
export const ROUTES_KEY = Symbol('routes');
export const CONTROLLER_KEY = Symbol('controller');
export const DOCS_KEY = Symbol('docs');
export const MIDDLEWARE_KEY = Symbol('middleware');

export function Controller(prefix: string = ''): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(CONTROLLER_KEY, prefix, target);
    };
}

function createMethodDecorator(method: string) {
    return (path: string): MethodDecorator =>
        (target, propertyKey) => {
            const routes = Reflect.getMetadata(ROUTES_KEY, target.constructor) || [];
            routes.push({ method, path, handler: propertyKey });
            Reflect.defineMetadata(ROUTES_KEY, routes, target.constructor);
        };
}

export const Get = createMethodDecorator('get');
export const Post = createMethodDecorator('post');

export const Put = createMethodDecorator('put');

export const Delete = createMethodDecorator('delete');

export const Patch = createMethodDecorator('patch');

export const Head = createMethodDecorator('head');

export const Options = createMethodDecorator('options');

export const Trace = createMethodDecorator('trace');

export const Connect = createMethodDecorator('connect');


export function Use(middleware: any): MethodDecorator {
    return (target, propertyKey) => {
        const middlewares = Reflect.getMetadata(MIDDLEWARE_KEY, target, propertyKey) || [];
        middlewares.push(middleware);
        Reflect.defineMetadata(MIDDLEWARE_KEY, middlewares, target, propertyKey);
    };
}

export function Doc(name: string, description: string): MethodDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata(DOCS_KEY, { name, description }, target, propertyKey);
    };
}
