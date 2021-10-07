import { Body, Controller, Delete, Get, Param, Post, ValidationPipe } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
    constructor(private tagService: TagService) {}

    @Get()
     findAllTags(){
      return  this.tagService.findAllTags();
     
    }

  //   @Post()
  //  async upsertTag(@Body() tagList:string[]){
  //   const tags = this.tagService.upsertTag(tagList);
  //   return {tags}
  //  }

   @Delete('/:id')
   deleteTag(@Param('id') id :number){
     return this.tagService.deleteTag(id);
   }
}
