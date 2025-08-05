import {Controller, Get} from "../../decorators";
import {OpenAPIService} from "@helpers/openapi/service";
import {Spec} from "@helpers/decorators/Spec";
import {ParameterizedContext} from "koa";

@Controller('/docs')
@Spec({
    name: 'API Documentation', description: 'API documentation using Redoc and OpenAPI',
})
export default class OpenAPIController {

    @Get('') @Spec({
        name: 'API Documentation Home', description: 'Home page for API documentation',
    }) async index(ctx: ParameterizedContext) {
        ctx.redirect('/docs/swagger');
    }

    @Get("/swagger") @Spec({
        name: 'Swagger UI', description: 'Swagger UI for API documentation',
    }) async swagger(ctx: ParameterizedContext) {
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

    @Get('/redoc') @Spec({
        name: 'Redoc', description: 'Redoc for API documentation',
    }) async redoc(ctx: ParameterizedContext) {
        ctx.type = 'html';
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

    @Get('/elements') @Spec({
        name: 'API Elements', description: 'List of API elements',
    }) async elements(ctx: ParameterizedContext) {
        ctx.type = 'html';
        ctx.body = `
      <!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Elements in HTML</title>
    <!-- Embed elements Elements via Web Component -->
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

    @Get('/openapi') @Spec({
        name: 'OpenAPI Specification', description: 'Redirect to OpenAPI JSON specification',
    }) async openapi(ctx: any) {
        ctx.redirect('/docs/openapi.json');
    }

    @Get('/openapi.json') @Spec({
        name: 'OpenAPI JSON', description: 'Get the OpenAPI JSON specification',
    }) async openapiJson(ctx: any) {
        ctx.set('Content-Type', 'application/json');
        ctx.body = OpenAPIService.getInstance().getOpenApiJson();
    }
}