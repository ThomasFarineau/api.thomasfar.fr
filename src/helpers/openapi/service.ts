import config from "config";
import _ from "lodash";

import nodePackage from "../../../package.json";

export type SetupConfig = {
  title?: string;
  version?: string;
  description?: string;
  servers?: { url: string }[];
  components?: {
    schemas?: { [name: string]: any };
    responses?: { [name: string]: any };
    parameters?: { [name: string]: any };
    examples?: { [name: string]: any };
    requestBodies?: { [name: string]: any };
    headers?: { [name: string]: any };
    securitySchemes?: { [name: string]: any  };
  },
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

  public defaultUI: OpenAPIUI = OpenAPIUI.SWAGGER_UI;

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

  public getOpenApiJson(): typeof this.openApiDoc {
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

  public setup(config: SetupConfig): void {
    this.openApiDoc.info = {
      title: config.title || nodePackage.name,
      version: config.version || nodePackage.version,
      description: config.description || nodePackage.description
    };

    if (config.servers) {
      this.openApiDoc.servers = config.servers;
    }

    if (config.components) {
      this.openApiDoc.components = {
        ...this.openApiDoc.components,
        ...config.components
      };
    }
  }
}
