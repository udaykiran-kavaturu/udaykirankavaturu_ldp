import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { CashKick } from './cash-kick.entity';

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

  @Column({
    type: 'int',
    nullable: true,
  })
  seeker_id: number | null;

  @ManyToOne(() => CashKick, { nullable: true })
  @JoinColumn({ name: 'cash_kick_id' })
  cash_kick_id: CashKick | number;

  @Column({
    type: 'int',
    nullable: true,
  })
  contract_id: number | null;

  @Column({
    type: 'enum',
    enum: CashKickContractStatus,
    nullable: false,
  })
  @IsEnum(CashKickContractStatus)
  @IsNotEmpty()
  status: CashKickContractStatus;

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
