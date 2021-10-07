import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, isString, IsString, MaxLength, MinLength, minLength } from "class-validator";

export class LoginDTO{
    @IsEmail()
    @MinLength(4)
    @IsString()
    @ApiProperty({type:String,description:"email"})
    email:string;

    @IsString()
    @MinLength(4)
    @ApiProperty({type:String,description:"password"})
    password:string;
}

export class RegisterDTO extends LoginDTO{
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @ApiProperty({type:String,description:"username"})
    username:string;
}

export class UpdateUserDTO{
    @IsOptional()
    @IsEmail()
    email:string;

    @IsOptional()
    bio:string;

    @IsOptional()
    image:string;
}

export interface AuthPayload{
    username:string;
}