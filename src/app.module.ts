import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './entities/user.entity';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { ArticleEntity } from './entities/article.entity';
import { CommentEntity } from './entities/comment.entity';
import { TagEntity } from './entities/tag.entity';
import { TagModule } from './tag/tag.module';


@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'article',
    entities: [UserEntity,ArticleEntity,CommentEntity,TagEntity],
    synchronize: true,
  }), AuthModule, UserModule, ArticleModule, TagModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
