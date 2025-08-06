import {Controller, Post} from "../decorators";
import { Spec } from "@helpers/decorators/OpenAPI";
import {AuthService} from "./service";
import {TokenService} from "@services/TokenService";


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
  async login(ctx: any) {
    const { username, password } = ctx.request.body;

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
  async refresh(ctx: any) {
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
    } catch (err: any) {
      ctx.status = 403;
      ctx.body = { error: "Refresh token invalide ou expiré" };
    }
  }
}
