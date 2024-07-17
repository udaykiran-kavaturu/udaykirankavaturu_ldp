import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsEnum, IsNumber, Min, Max } from 'class-validator';

export enum ContractType {
  MONTHLY = 'monthly',
}

@Entity('contract')
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  lender_id: number | null;

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
    type: 'int',
    nullable: true,
  })
  @IsNumber()
  @Min(1)
  @Max(31)
  scheduled_due_date: number;

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
