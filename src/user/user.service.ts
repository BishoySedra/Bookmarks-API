import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User as UserEntity } from '@prisma/client';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    async getMe(user: UserEntity) {
        return user;
    }

    async updateMe(userId: number, body: EditUserDto) {
        // check if the user exists
        const user = await this.prismaService.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new Error('User not found');
        }

        // update the user
        const updatedUser = await this.prismaService.user.update({
            where: { id: userId },
            data: body
        });

        delete updatedUser.hash;

        // return the updated user
        return updatedUser;
    }

}
