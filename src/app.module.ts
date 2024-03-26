import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@auth/auth.module';
import { DriverModule } from '@driver/driver.module';
import { MapModule } from '@map/map.module';
import { BookingModule } from '@booking/booking.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/dataSource';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule } from './modules/jwt/jwt.auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { RoleGuard } from '~guards/role.guard';
import { JwtGuard } from '~guards/jwt.guard';

@Module({
  imports: [
    JwtAuthModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync(dataSourceOptions),
    ScheduleModule.forRoot(),
    AuthModule,
    DriverModule,
    MapModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
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