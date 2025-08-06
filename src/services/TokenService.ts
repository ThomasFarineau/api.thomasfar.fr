import jwt, {JwtPayload} from "jsonwebtoken";
import config from "config";

const jwtConfig = config.get<{
    accessSecret: string;
    accessExpiresIn: number;
    refreshSecret: string;
    refreshExpiresIn: number
}>("jwt");

export class TokenService {
  static generateTokens(user: { id: string; role: string }) {
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

  static verifyAccessToken(token: string) {
    return jwt.verify(token, jwtConfig.accessSecret);
  }

  static verifyRefreshToken(token: string): JwtPayload {
    return <JwtPayload>jwt.verify(token, jwtConfig.refreshSecret);
  }
}
