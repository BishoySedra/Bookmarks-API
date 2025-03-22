import { Controller, Get, Request, UseGuards, Patch, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { jwtGuard } from '../auth/guard/jwt.guard';
import { User } from '../auth/decorator/user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { User as UserEntity } from '@prisma/client';
import { EditUserDto } from './dto';

@UseGuards(jwtGuard)
@Controller('users')
export class UserController {

    constructor(private readonly UserService: UserService,
        private prismaService: PrismaService
    ) { }

    @Get('me')
    getMe(@User() user: UserEntity) {
        return this.UserService.getMe(user);
    }

    @Patch('me')
    @HttpCode(HttpStatus.OK)
    updateMe(@User('id') userId: number, @Body() body: EditUserDto) {
        return this.UserService.updateMe(userId, body);

    }
}
