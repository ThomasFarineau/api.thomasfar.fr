import "reflect-metadata";

const SPEC_KEY = Symbol("spec");

export function Spec(spec: any): ClassDecorator & MethodDecorator {
    return (target: any, propertyKey?: string | symbol) => {
        if (propertyKey) {
            Reflect.defineMetadata(SPEC_KEY, spec, target, propertyKey);
        } else {
            Reflect.defineMetadata(SPEC_KEY, spec, target);
        }
    };
}

export function getSpec(target: any, propertyKey?: string | symbol): any {
    if (propertyKey) {
        return Reflect.getMetadata(SPEC_KEY, target, propertyKey);
    }
    return Reflect.getMetadata(SPEC_KEY, target);
}

