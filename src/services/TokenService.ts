import config from "config";
import jwt, {JwtPayload} from "jsonwebtoken";

const jwtConfig = config.get<{
    accessSecret: string;
    accessExpiresIn: number;
    refreshSecret: string;
    refreshExpiresIn: number
}>("jwt");

export class TokenService {
  public static generateTokens(user: { id: string; role: string }): {
    accessToken: string; refreshToken: string
  } {
    const accessToken = jwt.sign(
      {
        sub: user.id, role: user.role 
      },
      jwtConfig.accessSecret,
      { expiresIn: jwtConfig.accessExpiresIn }
    );

    const refreshToken = jwt.sign(
      { sub: user.id },
      jwtConfig.refreshSecret,
      { expiresIn: jwtConfig.refreshExpiresIn }
    );

    return {
      accessToken, refreshToken 
    };
  }

  public static verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, jwtConfig.accessSecret) as JwtPayload;
  }

  public static verifyRefreshToken(token: string): JwtPayload {
    return <JwtPayload>jwt.verify(token, jwtConfig.refreshSecret) || {};
  }
}
