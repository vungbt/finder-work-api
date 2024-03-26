import { AppConfig } from '@/configs/type';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AddressModule } from '../address/address.module';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { QueueModule } from '../common/queue/queue.module';

@Module({
  imports: [
    UserModule,
    AddressModule,
    CompanyModule,
    PrismaModule,
    QueueModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>) => {
        return {
          secret: configService.get('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: configService.get<number>('JWT_EXPIRES_IN')
          }
        };
      }
    }),
    PassportModule.register({
      defaultStrategy: ['jwt'],
      property: 'account',
      session: false
    })
  ],
  providers: [AuthResolver, AuthService],
  exports: [AuthService]
})
export class AuthModule {}
