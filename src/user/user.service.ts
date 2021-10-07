import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDTO } from 'src/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(@InjectRepository(UserEntity) private userRipo:Repository<UserEntity>){}

    async findByUsername(username: string,user?:UserEntity):Promise<UserEntity> {
      
        return await (await this.userRipo.findOne({where:{username},relations:['followers']})).toProfile(user);
    }

    // async updateUser(username:string,data:UpdateUserDTO):Promise<UserEntity> {
    //      await this.userRipo.update({username},data);
    //      return this.findByUsername(username);
    // }

  async  followUser(currentUser: UserEntity, username: string) {
    
    
      const user =await this.userRipo.findOne({where:{username},relations:['followers']});
        user.followers.push(currentUser);
        await user.save();
        return user.toProfile(currentUser,false);
    }

  async  unFollowUser(currentUser: UserEntity, username: string) {
      const user =await this.userRipo.findOne({where:{username},relations:['followers']});
     
      
      user.followers = user.followers.filter(follower => follower.id != currentUser.id);
    
      
        await user.save();
        return user.toProfile(currentUser,false);
    }
}
