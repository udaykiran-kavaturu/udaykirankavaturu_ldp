import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ContractsModule } from './contracts/contracts.module';
import { CashKicksModule } from './cash-kicks/cash-kicks.module';
import {
  User,
  Contract,
  CashKick,
  CashKickContract,
  PaymentSchedule,
} from './entities';
import { DashboardModule } from './dashboard/dashboard.module';

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
        poolOptions: {
          min: 5,
          max: 20,
          idleTimeoutMillis: 30000,
          acquireTimeoutMillis: 30000,
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: configService.get<number>('THROTTLER_TTL', 60000),
            limit: configService.get<number>('THROTTLER_LIMIT', 10),
          },
        ],
      }),
    }),
    ContractsModule,
    CashKicksModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
