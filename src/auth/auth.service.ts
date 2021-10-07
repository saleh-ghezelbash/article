import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { LoginDTO, RegisterDTO, UpdateUserDTO } from 'src/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private userRipo: Repository<UserEntity>,
        private jwtService: JwtService
    ) { }

    async login(credentials: LoginDTO) {
        try {
            const user = await this.userRipo.findOne({ where: { email: credentials.email } })

            if (user && await user.comparePassword(credentials.password)) {

                const payload = { username: user.username };
                const token = this.jwtService.sign(payload);

                return { user: { ...user.toJSON(), token } };
            }

            throw new UnauthorizedException('Invalid credentials!');
           

        } catch (err) {

            throw new InternalServerErrorException()
        }
    }

    async register(credentials: RegisterDTO) {
        try {
            const user = this.userRipo.create(credentials);

            await user.save();
            const payload = { username: user.username };
            const token = this.jwtService.sign(payload);

            return { user: { ...user.toJSON(), token } };
        } catch (err) {

            if (err.code == '23505') {
                throw new ConflictException('Username has already been taken!')
            }
            throw new InternalServerErrorException();
        }
    }

    async findCurrentUser(username:string){
        const user =   await this.userRipo.findOne({where:{username}})
        const payload = { username };
        const token = this.jwtService.sign(payload);

        return { user: { ...user.toJSON(), token } };
    }

    async updateUser(username:string,data:UpdateUserDTO) {
       await this.userRipo.update({username},data);
      const user =   await this.userRipo.findOne({where:{username}})
      const payload = { username };
      const token = this.jwtService.sign(payload);

      return { user: { ...user.toJSON(), token } };
   }
}
