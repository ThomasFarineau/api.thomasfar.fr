import "reflect-metadata";

const SPEC_KEY = Symbol("spec");

export function Spec(spec: any): ClassDecorator & MethodDecorator {
  return (target: any, propertyKey?: string | symbol) => {
    const oldSpec = getSpec(target, propertyKey) || {};
    const newSpec = {
      ...oldSpec, ...spec 
    };
    if (propertyKey) {
      Reflect.defineMetadata(SPEC_KEY, newSpec, target, propertyKey);
    } else {
      Reflect.defineMetadata(SPEC_KEY, newSpec, target);
    }
  };
}

export function getSpec(target: any, propertyKey?: string | symbol): any {
  if (propertyKey) {
    return Reflect.getMetadata(SPEC_KEY, target, propertyKey);
  }
  return Reflect.getMetadata(SPEC_KEY, target);
}

export function Hidden(target: any, propertyKey?: string | symbol) {
  if (propertyKey) {
    const spec = getSpec(target, propertyKey) || {};
    spec.hidden = true;
    Reflect.defineMetadata(SPEC_KEY, spec, target, propertyKey);
  }
}

export type ApiResponse = {
  status: number;
  description?: string;
  content?: any;
};

export function Response(response: ApiResponse): MethodDecorator {
  return (target: any, propertyKey: string | symbol) => {
    const spec = getSpec(target, propertyKey) || {};
    if (!spec.responses) {
      spec.responses = [];
    }
    spec.responses.push(response);
    Reflect.defineMetadata(SPEC_KEY, spec, target, propertyKey);
  };
}
