import { classToPlain } from "class-transformer";
import slugify from "slugify";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, RelationCount, RelationId } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import { CommentEntity } from "./comment.entity";
import { UserEntity } from "./user.entity";

@Entity('articles')
export class ArticleEntity extends AbstractEntity{
    @Column()
    title:string;

    @Column()
    slug:string;

    @Column()
    description:string;

    @Column()
    body:string;

    @Column('simple-array')
    tagList:string[];

    @ManyToOne(type => UserEntity,user => user.articles,{eager:true})
    author:UserEntity;

    @OneToMany(type => CommentEntity,comment => comment.article)
    comments:CommentEntity[]

    @ManyToMany(type => UserEntity,user => user.favorites,{eager:true})
    @JoinTable()
    favoritedBy:UserEntity[]

    favorited:boolean;

    @RelationCount((article:ArticleEntity) => article.favoritedBy)
    favoritesCount:number;

    @BeforeInsert()
    generateSlug(){
        this.slug = slugify(this.title,{lower:true})
    }

    toJSON(){
        return classToPlain(this);
    }

    toArticle(user:UserEntity,showFollowersList:boolean = true){
        let favorited = null;
        if (user) {
            
            favorited = this.favoritedBy.map(user => user.id).includes(user.id);
        }
        const article: any = this.toJSON();
        
        if (!showFollowersList) {
            delete article.favoritedBy;
        }
        
        return {...article,favorited}
    }

}