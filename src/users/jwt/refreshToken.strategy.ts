import { Controller, Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";

@Controller()
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh"
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "refreshToken",
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const authorizationHeader = req.get("Authorization");

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException(
        "Invalid or missing 'Authorization' header"
      );
    }

    const refreshToken = authorizationHeader.replace("Bearer ", "").trim();
    return { ...payload, refreshToken };
  }
}
