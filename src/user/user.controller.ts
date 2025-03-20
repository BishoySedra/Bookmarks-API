import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@Controller('users')
export class UserController {

    constructor(private readonly UserService: UserService) { }


    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(@Request() req: any) {
        // console.log(req.user);
        // return {
        //     user: req.user,
        //     message: 'This action returns my profile',
        // };
        return this.UserService.getMe(req.user);
    }
}
