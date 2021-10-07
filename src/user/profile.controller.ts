import { Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { UserService } from './user.service';

@Controller('profiles')
export class ProfileController {
    constructor(private userService: UserService) { }

    @Get('/:username')
    @UseGuards(new OptionalAuthGuard())
    async findProfile(@Param('username') username: string,@User() user:UserEntity) {
        const profile = await this.userService.findByUsername(username,user);
        if (!profile) {
            throw new NotFoundException();
        }
        return { profile }
    }

    @Post('/:username/follow')
    @HttpCode(200)
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    async followUser(@User() user: UserEntity, @Param('username') username: string) {
        const profile = await this.userService.followUser(user, username);
        return { profile }
    }

    @Delete('/:username/follow')
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    async unFollowUser(@User() user: UserEntity, @Param('username') username: string) {
        const profile = await this.userService.unFollowUser(user, username);
        return { profile }
    }
}
