import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { AuthPayload } from "../dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    validate(payload: AuthPayload) {
        return payload;
    }
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        })
    }
}