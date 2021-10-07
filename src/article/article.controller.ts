import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { CreateArticleDTO, FindAllQuery, FindFeedQuery } from 'src/models/article.model';
import { CreateCommentDTO } from 'src/models/comment.model';
import { ArticleService } from './article.service';
import { CommentsService } from './comments.service';

@Controller('articles')
export class ArticleController {
    constructor(
        private articleService: ArticleService,
        private commentService: CommentsService
    ) { }

    @Get('/:slug')
    @UseGuards(new OptionalAuthGuard())
    // @UseGuards(AuthGuard())
    async findBySlug(
        @Param('slug') slug: string,
        @User() user: UserEntity
    ) {
        const article = await this.articleService.findBySlug(slug,user);
        return {
            article,
            // article: article.toArticle(user)
        }
    }

    @Get()
    @UseGuards(new OptionalAuthGuard())
    // @UseGuards(AuthGuard())
    async findAll(@User() user: UserEntity, @Query() query: FindAllQuery) {
        const articles = await this.articleService.findAll(user, query);
        return {
            articles,
            articlesCount: articles.length
        }
    }

    @Get('/feed')
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    async findFeed(@User() user: UserEntity, @Query() query: FindFeedQuery) {
        
        const articles = await this.articleService.findFeed(user, query);
        return {
            articles,
            articlesCount: articles.length
        }
    }

    @Post()
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    async createArticle(@User() user: UserEntity, @Body() data:  CreateArticleDTO ) {
        
        const article = await this.articleService.createArticle(user, data);
        return { article }
    }

    @Put('/:slug')
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    async updateArticle(@Param('slug') slug: string, @User() user: UserEntity, @Body(ValidationPipe) data: { article: CreateArticleDTO }) {
        const article = await this.articleService.updateArticle(slug, user, data.article);
        return { article }
    }

    @Delete('/:slug')
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    async deleteArticle(@Param('slug') slug: string, @User() user: UserEntity) {
        
        const article = await this.articleService.deleteArticle(slug, user);
        return { article }
    }

    @Post('/:slug/favorite')
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    async favoriteArticle(@Param('slug') slug: string, @User() user: UserEntity) {
        const article = await this.articleService.favoriteArticle(slug, user);
        return { article }
    }

    @Delete('/:slug/favorite')
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    async unFavoriteArticle(@Param('slug') slug: string, @User() user: UserEntity) {
        const article = await this.articleService.unFavoriteArticle(slug, user);
        return { article }
    }

    @Get('/:slug/comments')
    async findComments(@Param('slug') slug: string) {
        const comments = await this.commentService.findByArticleSlug(slug);
        return { comments }
    }

    @Post('/:slug/comments')
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    async createComment(@Param('slug') slug:string,@User() user: UserEntity, @Body(ValidationPipe) data: CreateCommentDTO ) {
        const comment = await this.commentService.createComment(slug,user, data);
        return { comment };
    }

    @Delete('/:slug/comments/:id')
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    async deleteComment(@User() user: UserEntity, @Param('id') id: number) {
        const comment = await this.commentService.deleteComment(id);
        return { comment };
    }
}
