import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as HashingOperations from "argon2";
import { JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {

    constructor(
        private prismaService: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) { }

    async login(dto: AuthDto) {
        // check if the user exists
        const found_user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email
            }
        });

        // if the user does not exist, return an error
        if (!found_user) {
            return {
                message: 'Invalid Credentials!'
            }
        }

        // check if the password is correct
        const is_valid = await HashingOperations.verify(found_user.hash, dto.password);

        // if the password is incorrect, return an error
        if (!is_valid) {
            return {
                message: 'Invalid Credentials!'
            }
        }

        // sign a token and return it
        const token = await this.signToken(found_user.id, found_user.email);

        return {
            token
        }
    }

    async signup(dto: AuthDto) {
        console.log(dto);
        // generate a hash of the password
        const hash = await HashingOperations.hash(dto.password);

        console.log(hash);

        // create a new user object
        const user = {
            email: dto.email,
            hash
        }

        try {
            // save the user to the database
            const created_user = await this.prismaService.user.create({
                data: user
            });

            delete created_user.hash;

            return created_user;
        } catch (error) {
            if (error.code === 'P2002') {
                return {
                    message: 'User already exists'
                }
            }
        }


    }

    async signToken(id: number, email: String): Promise<string> {
        const payload = { email, sub: id };

        const token = await this.jwt.signAsync(payload, {
            secret: this.config.get<string>('JWT_SECRET'),
            expiresIn: '1d'
        })

        return token;
    }
}