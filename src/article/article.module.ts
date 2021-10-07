import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ArticleEntity } from 'src/entities/article.entity';
import { CommentEntity } from 'src/entities/comment.entity';
import { UserEntity } from 'src/entities/user.entity';
import { TagModule } from 'src/tag/tag.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { CommentsService } from './comments.service';

@Module({
  imports:[TypeOrmModule.forFeature([ArticleEntity,UserEntity,CommentEntity]),AuthModule,TagModule],
  controllers: [ArticleController],
  providers: [ArticleService, CommentsService]
})
export class ArticleModule {}
