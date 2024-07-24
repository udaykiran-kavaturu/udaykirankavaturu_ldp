import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsEnum, IsNumber, Min, IsDate } from 'class-validator';
import { CashKick } from './cash-kick.entity';

export enum PaymentScheduleStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

@Entity('payment_schedule')
export class PaymentSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  lender_id: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  seeker_id: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  cash_kick_id: CashKick | null | number;

  @Column({
    type: 'int',
    nullable: true,
  })
  contract_id: number | null;

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
    type: 'date',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  due_date: Date;

  @Column({
    type: 'enum',
    enum: PaymentScheduleStatus,
    nullable: false,
  })
  @IsEnum(PaymentScheduleStatus)
  @IsNotEmpty()
  status: PaymentScheduleStatus;

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
