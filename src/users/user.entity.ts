import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

export enum UserType {
    LENDER = 'lender',
    SEEKER = 'seeker'
}

@Entity('user')
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: UserType,
        nullable: false
    })
    type: UserType;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    name: string;

    @Column({
        type: 'tinyint',
        width: 1,
        default: 1
    })
    status: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
        default: 0
    })
    credit_limit: number | null;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
        default: 0
    })
    credit_balance: number | null;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    @Exclude()
    password: string;
}