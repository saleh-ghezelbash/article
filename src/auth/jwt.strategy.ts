import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthPayload } from 'src/models/user.model';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(UserEntity) private userRipo:Repository<UserEntity>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Token'),
      ignoreExpiration: false,
      secretOrKey: 'mysecret'
    });
  }

  async validate(payload: AuthPayload) {
    const user = this.userRipo.find({where:{username:payload.username}})
    if (!user) {
         throw new UnauthorizedException();
    }
    return user;
  }
}