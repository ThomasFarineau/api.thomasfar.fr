import {TokenService} from "@services/TokenService";

export async function authMiddleware(ctx: any, next: Function) {
  const authHeader = ctx.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'Token manquant' };
    return;
  }

  try {
    ctx.state.user = TokenService.verifyAccessToken(token);
    await next();
  } catch (err) {
    ctx.status = 403;
    ctx.body = { error: 'Token invalide ou expiré' };
  }
}