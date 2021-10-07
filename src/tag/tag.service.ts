import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from 'src/entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
    constructor(@InjectRepository(TagEntity) private tagRipo: Repository<TagEntity>) { }

    findAllTags() {
        return  this.tagRipo.find();
    }

    async upsertTag(tagList:string[]) {
        
        
        const foundTag = await this.tagRipo.find({
            where: tagList.map(t => ({ tag: t }))
        })
        

        const newTag = tagList.filter(t => !foundTag.map(t => t.tag).includes(t));
        

      return  await Promise.all(this.tagRipo.create(newTag.map(t => ({ tag: t }))).map(t => t.save()));
    }

    async deleteTag(id:number){
       await this.tagRipo.delete(id);
    }
}
