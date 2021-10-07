import { classToPlain, Exclude } from "class-transformer";
import { IsEmail } from "class-validator";
import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany } from "typeorm";
import * as bcrypt from "bcryptjs";
import { AbstractEntity } from "./abstract-entity";
import { ArticleEntity } from "./article.entity";
import { CommentEntity } from "./comment.entity";

@Entity('users')
export class UserEntity extends AbstractEntity{
    @Column()
    @IsEmail()
    email:string;

    @Column({unique:true})
    username:string;

    @Column()
    @Exclude()
    password:string;

    @Column({default:null,nullable:true})
    image:string | null;

    @Column({default:''})
    bio:string;

    @ManyToMany(type => UserEntity,user => user.followee)
    @JoinTable()
    followers:UserEntity[]

    @ManyToMany(type => UserEntity,user => user.followers)
    followee:UserEntity[]

    @OneToMany(type => ArticleEntity,article => article.author)
    articles:ArticleEntity[]

    @OneToMany(type => CommentEntity,comment => comment.author)
    comments:CommentEntity[]

    @ManyToMany(type => ArticleEntity,article => article.favoritedBy)
    @JoinColumn()
    favorites:ArticleEntity[]

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password,10);
    }

    async comparePassword(attempt:string){
        return await bcrypt.compare(attempt,this.password);
    }

    toJSON(){
        return classToPlain(this)
    }

    toProfile(user?:UserEntity,showFollowersList:boolean = true){
        
        let following = null;
        if (user) {
            following = this.followers.some(item => item.id == user.id)
            // following = this.followers.includes(user);
        } 
    
        
        const profile: any = this.toJSON();
        if (!showFollowersList) {
            delete profile.followers;
        }
        return {...profile,following}
    }
}