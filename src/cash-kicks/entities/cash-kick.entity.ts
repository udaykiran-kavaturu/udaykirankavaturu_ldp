import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsEnum, IsNumber, Min, IsDate } from 'class-validator';
import { User } from '../../users/user.entity';

export enum CashKickStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    COMPLETED = 'completed'
}

@Entity('cash_kick')
export class CashKick {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'seeker_id' })
    seeker: User;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    @IsNotEmpty()
    name: string;

    @Column({
        type: 'date',
        nullable: true
    })
    @IsDate()
    maturity_date: Date;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.00
    })
    @IsNumber()
    @Min(0)
    total_financed: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.00
    })
    @IsNumber()
    @Min(0)
    total_received: number;

    @Column({
        type: 'enum',
        enum: CashKickStatus,
        nullable: false
    })
    @IsEnum(CashKickStatus)
    @IsNotEmpty()
    status: CashKickStatus;
}