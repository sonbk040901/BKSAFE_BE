import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserController } from './auth.user.controller';
import { JwtModule } from '@nestjs/jwt';
import { BcryptService } from '~utils/bcrypt.service';
import { UtilsModule } from '~utils/utils.module';
import { AuthDriverController } from '@auth/auth.driver.controller';
import { AuthAdminController } from '@auth/auth.admin.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
      }),
    }),
    UtilsModule,
  ],
  controllers: [AuthUserController, AuthDriverController, AuthAdminController],
  providers: [AuthService, BcryptService],
  exports: [AuthService],
})
export class AuthModule {}
