import { AuthModule } from '@auth/auth.module';
import { BookingModule } from '@booking/booking.module';
import { DriverModule } from '@driver/driver.module';
import { MapModule } from '@map/map.module';
import { CacheModule } from '@nestjs/cache-manager';
import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from '~/modules/profile/profile.module';
import { JwtGuard } from '~guards/jwt.guard';
import { RoleGuard } from '~guards/role.guard';
import { dataSourceOptions } from './database/dataSource';
import { JwtAuthModule } from './modules/jwt/jwt.auth.module';
import { SettingModule } from './modules/setting/setting.module';
import { UserModule } from './modules/user/user.module';
import { ChatModule } from '~/modules/chat/chat.module';
import { NotificationModule } from '~/modules/notification/notification.module';

@Module({
  imports: [
    JwtAuthModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync(dataSourceOptions),
    ScheduleModule.forRoot(),
    CacheModule.register({ isGlobal: true }),
    AuthModule,
    DriverModule,
    MapModule,
    BookingModule,
    UserModule,
    ProfileModule,
    SettingModule,
    ChatModule,
    NotificationModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_GUARD, useClass: JwtGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          // enableDebugMessages: true,
          // validationError: { target: true, value: true },
        }),
    },
  ],
})
export class AppModule {}
