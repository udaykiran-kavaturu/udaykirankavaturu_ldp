import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserType {
  LENDER = 'lender',
  SEEKER = 'seeker',
  ADMIN = 'admin',
}

@Entity('user')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserType,
    nullable: false,
  })
  type: UserType;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'tinyint',
    width: 1,
    default: 1,
  })
  status: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 100000,
  })
  credit_limit: number | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 100000,
  })
  credit_balance: number | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @Exclude()
  password: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  created_by: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  updated_by: number | null;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
