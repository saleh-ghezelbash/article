import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateArticleDTO{
    @IsString()
    title:string;

    @IsString()
    body:string;

    @IsString()
    description:string;

    @IsArray()
    @IsString({each:true})
    tagList:string[];
}

export class UpdateArticleDTO{
    @IsString()
    @IsOptional()
    title:string;

    @IsString()
    @IsOptional()
    body:string;

    @IsString()
    @IsOptional()
    description:string;

    @IsOptional()
    @IsArray()
    @IsString({each:true})
    tagList:string[];
}



export interface FindFeedQuery{
    limit?:number;
    offset?:number;
}

export interface FindAllQuery extends FindFeedQuery{
    tag?:string;
    author?:string;
    favorited?:string;
}