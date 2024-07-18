import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsEnum, IsNumber, Min, IsDate } from 'class-validator';
import { User } from './user.entity';

export enum CashKickStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

@Entity('cash_kick')
export class CashKick {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  seeker_id: number | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @IsNotEmpty()
  name: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  @IsDate()
  maturity_date: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  @IsNumber()
  @Min(0)
  total_financed: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  @IsNumber()
  @Min(0)
  total_received: number;

  @Column({
    type: 'enum',
    enum: CashKickStatus,
    nullable: false,
  })
  @IsEnum(CashKickStatus)
  @IsNotEmpty()
  status: CashKickStatus;

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
