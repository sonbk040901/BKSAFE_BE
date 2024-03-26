import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RepositoriesModule } from '~repos/repositories.module';
import { JwtModule } from '@nestjs/jwt';
import { BcryptService } from '~utils/bcrypt.service';
import { UtilsModule } from '~utils/utils.module';

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
    RepositoriesModule,
    UtilsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, BcryptService],
  exports: [AuthService],
})
export class AuthModule {}
