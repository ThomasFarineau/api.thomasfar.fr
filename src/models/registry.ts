export const modelRegistry: Record<string, any> = {};

export function Model(name: string) {
    return function (constructor: any) {
        constructor.collectionName = name;
        modelRegistry[name] = constructor;
    }
}
