import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { ContractsModule } from './contracts/contracts.module';
import { CashKicksModule } from './cash-kicks/cash-kicks.module';
import { Contract } from './contracts/contract.entity';
import { CashKick } from './cash-kicks/entities/cash-kick.entity';
import { CashKickContract } from './cash-kicks/entities/cash-kick-contract.entity';
import { PaymentSchedule } from './cash-kicks/entities/payment-schedule.entity';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Contract, CashKick, CashKickContract, PaymentSchedule],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ContractsModule,
    CashKicksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
