import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsEnum, IsNumber, Min, IsDate } from 'class-validator';
import { CashKick } from './cash-kick.entity';
import { Contract } from './contract.entity';
import { User } from './user.entity';


export enum PaymentScheduleStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

@Entity('payment_schedule')
export class PaymentSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'lender_id' })
  lender: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'seeker_id' })
  seeker: User;

  @ManyToOne(() => CashKick, { nullable: true })
  @JoinColumn({ name: 'cash_kick_id' })
  cashKick: CashKick;

  @ManyToOne(() => Contract, { nullable: true })
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;

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
}
