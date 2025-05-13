import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Уникальный идентификатор пользователя' })
  id: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'Email пользователя' })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Дата создания' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Дата обновления' })
  updatedAt: Date;
}