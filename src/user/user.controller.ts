import { Body, Controller, Get, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDTO } from 'src/models/user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private authService:AuthService){}

    @Get()
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    findCurrentUser(@User() {username}:UserEntity){
        return this.authService.findCurrentUser(username);
    }

    @Put()
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    updateUser(@User() {username}:UserEntity,@Body(new ValidationPipe({transform:true,whitelist:true})) data:UpdateUserDTO){
        return this.authService.updateUser(username,data)
    }
}
