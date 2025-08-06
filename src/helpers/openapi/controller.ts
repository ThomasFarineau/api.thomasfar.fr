import { Controller, Get } from "../../decorators";
import { OpenAPIService } from "@helpers/openapi/service";
import { Hidden, Response, Spec } from "@helpers/decorators/OpenAPI";
import { ParameterizedContext } from "koa";

@Controller("/docs")
@Spec({
  name: "OpenAPI Documentation",
  description: "Provides OpenAPI documentation and UI endpoints"
})
export default class OpenAPIController {
  @Get()
  @Spec({
    name: "API Documentation Home",
    description: "Home page for API documentation"
  })
  @Response({
    status: 302,
    description: `Redirects to the default OpenAPI UI (${OpenAPIService.getInstance().defaultUI || "swagger-ui"})`
  })
  async index(ctx: ParameterizedContext) {
    ctx.redirect(`/docs/${OpenAPIService.getInstance().defaultUI}`);
  }

  @Get("/swagger-ui") @Hidden async swagger(ctx: ParameterizedContext) {
    ctx.type = "html";
    ctx.body = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <title>Swagger UI</title>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.15.0/swagger-ui.css">
            </head>
            <body>
                <div id="swagger-ui"></div>
                <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.15.0/swagger-ui-bundle.js"></script>
                <script>
                  window.onload = function() {
                    SwaggerUIBundle({
                      url: '/docs/openapi.json',
                      dom_id: '#swagger-ui',
                      deepLinking: true
                    });
                  };
                </script>
            </body>
        </html>
        `;
  }

  @Get("/redoc") @Hidden async redoc(ctx: ParameterizedContext) {
    ctx.type = "html";
    ctx.body = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>API Docs</title>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { margin:0; padding:0; }
          </style>
        </head>
        <body>
          <redoc spec-url="/docs/openapi.json"></redoc>
                <script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"></script>
        </body>
      </html>
    `;
  }

  @Get("/elements") @Hidden async elements(ctx: ParameterizedContext) {
    ctx.type = "html";
    ctx.body = `
      <!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Elements in HTML</title>
    <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
  </head>
  <body>

    <elements-api
      apiDescriptionUrl="/docs/openapi.json"
      router="hash"
      layout="sidebar"
    />

  </body>
</html>
        
    `;
  }

  @Get("/openapi") @Hidden async openapi(ctx: any) {
    ctx.redirect("/docs/openapi.json");
  }

  @Get("/openapi.json")
  @Spec({
    name: "OpenAPI Specification",
    description: "Redirect to OpenAPI JSON specification"
  })
  @Response({
    status: 200,
    description: "Returns the OpenAPI JSON specification",
    content: {
      "application/json": {
        schema: {
          type: "object"
        }
      }
    }
  })
  async openapiJson(ctx: any) {
    ctx.set("Content-Type", "application/json");
    ctx.body = OpenAPIService.getInstance().getOpenApiJson();
  }
}
