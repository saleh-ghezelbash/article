import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { TagEntity } from 'src/entities/tag.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateArticleDTO, FindAllQuery, FindFeedQuery, UpdateArticleDTO } from 'src/models/article.model';
import { TagService } from 'src/tag/tag.service';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity) private articleRipo: Repository<ArticleEntity>,
        @InjectRepository(UserEntity) private userRipo: Repository<UserEntity>,
        private tagService: TagService
    ) { }

    private ensureOwnerShip(user: UserEntity, article: ArticleEntity): boolean {
        return user.id === article.author.id;
    }

    // private async upsertTag(tagList: string[]) {
        
        
    //     const foundTag = await this.tagRipo.find({
    //         where: tagList.map(t => ({ tag: t }))
    //     })
        

    //     const newTag = tagList.filter(t => !foundTag.map(t => t.tag).includes(t));
        

    //     await Promise.all(this.tagRipo.create(newTag.map(t => ({ tag: t }))).map(t => t.save()));
    // }

   async findBySlug(slug: string,user?:UserEntity) {
       
        // return this.articleRipo.findOne({ where: { slug } })
        let article = await  this.articleRipo.createQueryBuilder('com')
        .leftJoinAndSelect('com.comments','comments')
        .leftJoinAndSelect('com.author','author')
        .leftJoinAndSelect('com.favoritedBy','favoritedBy')
        .where('com.slug = :slug',{slug})
        .getOne();      

        if (user) {
            if (article.favoritedBy.some(item => item.id == user.id)) {
                article.favorited = true;
            }
        }
        return article;
    }

    async findAll(user: UserEntity, query: FindAllQuery) {
        let findOptions: any = {
            where: {}
        }

        if (query.author) {
            findOptions.where['author.username'] = query.author;
        }

        if (query.favorited) {
            findOptions.where['favoritedBy.username'] = query.favorited;
        }

        if (query.tag) {
            findOptions.where.tagList = Like(`%${query.tag}%`)
        }

        if (query.limit) {
            findOptions.limit = query.limit;
        }

        if (query.offset) {
            findOptions.offset = query.offset;
        }
      
        

        // return (await (this.articleRipo.find(findOptions))).map(article => {
        //    return article.toArticle(user);
        // })
        return await this.articleRipo.find(findOptions);
        
    }

    async findFeed(user: UserEntity, query: FindFeedQuery) {
        const { followee } = await this.userRipo.findOne({
            where: { id: user.id },
            relations: ['followee']
        });

        const findOptions = {
            ...query,
            where: followee.map(follow => ({ author: follow.id }))
        }

        return (await (this.articleRipo.find(findOptions))).map(article => {
            article.toArticle(user);
        })
    }

    async createArticle(user: UserEntity, data: CreateArticleDTO) {
        
        const article = this.articleRipo.create(data);
        article.author = user;
        await this.tagService.upsertTag(data.tagList);
        const { slug } = await article.save();
        
        
        return (await this.articleRipo.findOne({ where: { slug } })).toArticle(user);
    }

    async updateArticle(slug: string, user: UserEntity, data: UpdateArticleDTO) {
        const article = await this.findBySlug(slug);
        if (!this.ensureOwnerShip(user, article)) {
            throw new UnauthorizedException();
        }
        await this.articleRipo.update({ slug }, data);
        return article.toArticle(user);
    }

    async deleteArticle(slug: string, user: UserEntity) {
        const article = await this.findBySlug(slug);
        if (!this.ensureOwnerShip(user, article)) {
            throw new UnauthorizedException("You dont allow to delete this article!");
        }
        await this.articleRipo.remove(article);

    }

    async favoriteArticle(slug: string, user: UserEntity) {
        const article = await this.findBySlug(slug);
        article.favoritedBy.push(user);
        await article.save();
        return (await this.findBySlug(slug)).toArticle(user,false);

    }

    async unFavoriteArticle(slug: string, user: UserEntity) {
        const article = await this.findBySlug(slug);
        article.favoritedBy = article.favoritedBy.filter(fav => fav.id != user.id);
        await article.save();
        return article.toArticle(user,false);
    }
}
