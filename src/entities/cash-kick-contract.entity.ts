import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { CashKick } from './cash-kick.entity';
import { Contract } from './contract.entity';
import { User } from './user.entity';

export enum CashKickContractStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

@Entity('cash_kick_contract')
export class CashKickContract {
  @PrimaryGeneratedColumn()
  id: number;

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
    type: 'enum',
    enum: CashKickContractStatus,
    nullable: false,
  })
  @IsEnum(CashKickContractStatus)
  @IsNotEmpty()
  status: CashKickContractStatus;
}
