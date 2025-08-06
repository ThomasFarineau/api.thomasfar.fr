import { Spec } from "@helpers/decorators/OpenAPI";
import {TokenService} from "@services/TokenService";

import {Controller, Post} from "../decorators";
import {AuthService} from "./service";

@Controller("/auth")
@Spec({
  name: "Auth",
  description: "Authentication and authorization endpoints"
})
export default class AuthController {

  constructor(private authService = new AuthService()) {}

  @Post("/login")
  @Spec({
    name: "User Login",
    description: "Authenticate a user and return a JWT token"
  })
  public async login(ctx: any): Promise<void> {
    const {
      username, password 
    } = ctx.request.body;

    try {
      const user = await this.authService.login(username, password);
      const tokens = TokenService.generateTokens(user);

      ctx.body = {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      };
    } catch (err: any) {
      ctx.status = 401;
      ctx.body = { error: err.message };
    }
  }

  @Post("/refresh")
  public async refresh(ctx: any): Promise<void> {
    const { refreshToken } = ctx.request.body;

    if (!refreshToken) {
      ctx.status = 400;
      ctx.body = { error: "Refresh token manquant" };
      return;
    }

    try {
      const payload = TokenService.verifyRefreshToken(refreshToken);
      ctx.assert(payload.sub, 400, "Refresh token invalide");
      const newTokens = TokenService.generateTokens({
        id: payload.sub ?? "",
        role: payload.role ?? "user"
      });

      ctx.body = {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      ctx.status = 403;
      ctx.body = { error: "Refresh token invalide ou expiré" };
    }
  }
}
