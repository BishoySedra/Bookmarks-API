import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    async getMe(decoded_token: any) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: decoded_token.sub
            }
        });

        if (!user) {
            return {
                message: 'User not found!'
            }
        }

        delete user.hash;

        return user;
    }
}
