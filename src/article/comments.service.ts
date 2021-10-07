import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { CommentEntity } from 'src/entities/comment.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateCommentDTO } from 'src/models/comment.model';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentEntity) private commentRipo:Repository<CommentEntity>,
        @InjectRepository(ArticleEntity) private articleRipo: Repository<ArticleEntity>,
        ){}

    findByArticleSlug(slug:string){
        
      return  this.articleRipo.createQueryBuilder('com').leftJoinAndSelect('com.comments','comments')
      .where('com.slug = :slug',{slug})
      .getOne();
        // return this.commentRipo.find({where:{'article.slug':slug},relations:['article']})
    }

    findById(id:number){
        return this.commentRipo.findOne(id);
    }

   async createComment(slug:string,user:UserEntity,data:CreateCommentDTO){
        const comment =  this.commentRipo.create(data);
        const article = await this.articleRipo.findOne({ where: { slug } })
        
        comment.author = user;
        comment.article = article;
        await  comment.save();
        return this.commentRipo.findOne({where:{body:data.body}})

    }

   async deleteComment(id:number){
        const comment = await this.commentRipo.findOne({where:{id}});
        await comment.remove();
        return 'ok';
    }
}
