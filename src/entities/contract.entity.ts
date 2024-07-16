import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsEnum, IsNumber, Min, IsDate } from 'class-validator';
import { User } from '../entities/user.entity';

export enum ContractType {
  MONTHLY = 'monthly',
}

@Entity('contract')
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'lender_id' })
  lender: User;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @IsNotEmpty()
  name: string;

  @Column({
    type: 'enum',
    enum: ContractType,
    nullable: false,
  })
  @IsEnum(ContractType)
  @IsNotEmpty()
  type: ContractType;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  fee: number;

  @Column({
    type: 'tinyint',
    width: 1,
    default: 1,
  })
  status: number;

  @Column({
    type: 'date',
    nullable: true,
  })
  @IsDate()
  scheduled_due_date: Date;
}
