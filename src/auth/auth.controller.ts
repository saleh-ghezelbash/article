import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginDTO, RegisterDTO } from 'src/models/user.model';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
    constructor(private authService : AuthService){}

    @Post('/register')
    @ApiCreatedResponse({description:"User Registeration"})
    // @ApiBody({type:RegisterDTO})
    register(@Body(ValidationPipe) credentials: RegisterDTO){
      return  this.authService.register(credentials);
    }

    @Post('/login')
    @ApiOkResponse({description:"User Login"})
    @ApiUnauthorizedResponse({description:"Invalid Credentials"})
    @ApiBody({type:LoginDTO})
    login(@Body(ValidationPipe) credentials:LoginDTO){
      return  this.authService.login(credentials);
    }
}
