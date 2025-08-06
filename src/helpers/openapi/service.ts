import nodePackage from "../../../package.json";
import config from "config";
import _ from "lodash";

export type SetupConfig = {
  title?: string;
  version?: string;
  description?: string;
  servers?: { url: string }[];
  tags?: { name: string; description?: string }[];
};

export enum OpenAPIUI {
  SWAGGER_UI = "swagger-ui",
  REDOC = "redoc",
  ELEMENTS = "elements",
}

export class OpenAPIService {
  private static instance: OpenAPIService;

  private readonly openApiDoc: any;

  defaultUI: OpenAPIUI = OpenAPIUI.SWAGGER_UI;

  private constructor() {
    this.openApiDoc = {
      openapi: "3.1.1",
      info: {
        title: nodePackage.name,
        version: nodePackage.version,
        description: nodePackage.description
      },
      servers: [
        {
          url: config.get("url")
        }
      ],
      paths: {},
      components: {},
      tags: []
    };
  }

  public static getInstance(): OpenAPIService {
    if (!OpenAPIService.instance) {
      OpenAPIService.instance = new OpenAPIService();
    }
    return OpenAPIService.instance;
  }

  public getOpenApiJson() {
    return this.openApiDoc;
  }

  public addRoute(path: string, method: string, spec: any): void {
    if (!this.openApiDoc.paths[path]) {
      this.openApiDoc.paths[path] = {};
    }
    this.openApiDoc.paths[path][method] = {
      operationId: _.camelCase([path, method].join("_")),
      ...spec
    };
  }

  public addComponent(componentType: string, name: string, schema: any): void {
    if (!this.openApiDoc.components[componentType]) {
      this.openApiDoc.components[componentType] = {};
    }
    this.openApiDoc.components[componentType][name] = schema;
  }

  public addTag(
    tag: { name: string; "x-displayName"?: string; description?: string } & {
      [key: string]: string;
    }
  ): void {
    if (!this.openApiDoc.tags.some((t: any) => t.name === tag.name)) {
      this.openApiDoc.tags.push(tag);
    }
  }

  public addTags(tags: { name: string; description?: string }[]): void {
    tags.forEach((tag) => this.addTag(tag));
  }

  setup(config: SetupConfig) {
    this.openApiDoc.info = {
      title: config.title || nodePackage.name,
      version: config.version || nodePackage.version,
      description: config.description || nodePackage.description
    };

    if (config.servers) {
      this.openApiDoc.servers = config.servers;
    }
  }
}
