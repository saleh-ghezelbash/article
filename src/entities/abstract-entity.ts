import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class AbstractEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @CreateDateColumn()
    createdAt:Date;

    @CreateDateColumn()
    updatedAt:Date;
}