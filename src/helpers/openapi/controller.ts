import {Hidden, Response, Spec} from "@helpers/decorators/OpenAPI";
import {ParameterizedContext} from "koa";

import {OpenAPIService} from "./service";
import {Controller, Get} from "../../decorators";

export const UI_TEMPLATES: Record<string, { title: string; head: string; initScript: string }> = {
  "swagger-ui": {
    title: "Swagger UI", head: `
      <link rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.15.0/swagger-ui.css" />`, initScript: `
      <div id="swagger-ui"></div>
      <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.15.0/swagger-ui-bundle.js"></script>
      <script>
        window.onload = () => SwaggerUIBundle({
          url: '/docs/openapi.json',
          dom_id: '#swagger-ui',
          deepLinking: true
        });
      </script>`
  }, redocly: {
    title: "ReDoc", head: `<!-- no extra CSS -->`, initScript: `
      <redoc spec-url="/docs/openapi.json"></redoc>
      <script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"></script>`
  }, elements: {
    title: "Stoplight Elements", head: `
      <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css" />`, initScript: `
      <elements-api
        apiDescriptionUrl="/docs/openapi.json"
        router="hash"
        layout="sidebar"
      ></elements-api>
      <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>`
  }, scalar: {
    title: "Scalar API Reference", head: `<!-- no extra CSS -->`, initScript: `
      <div id="scalar-app"></div>
      <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
      <script>
        Scalar.createApiReference('#scalar-app', {
          url: '/docs/openapi.json',
        });
      </script>`
  }, rapidoc: {
    title: "RapiDoc", head: `
      <script type="module"
              src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>`, initScript: `
      <rapi-doc
        spec-url="/docs/openapi.json"
        render-style="read"
        show-components
        allow-server-selection
      ></rapi-doc>`
  }
};

@Controller("/docs")
@Spec({
  name: "OpenAPI Documentation", description: "Provides OpenAPI documentation and UI endpoints"
})
export default class OpenAPIController {
    @Get()
    @Spec({
      name: "API Docs Home", description: "Redirects to default UI"
    })
    @Response({
      status: 302, description: `Redirect to default UI`
    })
  public async index(ctx: ParameterizedContext): Promise<void> {
    ctx.redirect(`/docs/${OpenAPIService.getInstance().defaultUI}`);
  }

    @Get("/openapi.json")
    @Spec({
      name: "OpenAPI JSON", description: "Returns the OpenAPI spec"
    })
    @Response({
      status: 200, description: "application/json"
    })
    public async openapiJson(ctx: ParameterizedContext): Promise<void> {
      ctx.type = "application/json";
      ctx.body = OpenAPIService.getInstance().getOpenApiJson();
    }

    @Get("/:ui")
    @Hidden
    public async renderUi(ctx: ParameterizedContext): Promise<void> {
      const ui = ctx.params.ui;
      const tpl = UI_TEMPLATES[ui];
      if (!tpl) {
        ctx.throw(404, `Unknown UI '${ui}'`);
      }
      ctx.type = "html";
      ctx.body = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${tpl.title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          ${tpl.head}
          <style>body{margin:0;padding:0;}</style>
        </head>
        <body>
          ${tpl.initScript}
        </body>
      </html>`;
    }
}
