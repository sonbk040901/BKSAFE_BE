import { Body, Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Permit } from '~decors/meta/permit.decorator';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { Account } from '~entities/account.entity';
import { LoginDto } from './dto/login.dto';
import { Roles } from '~decors/meta/roles.decorator';
import { RegisterDriverDto } from '@auth/dto/register-driver.dto';
import { RegisterDriverByUserDto } from '@auth/dto/register-driver-by-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(['', 'user-info'])
  @Roles('user')
  getInfo(@CurrentAcc() account: Account) {
    return account;
  }

  @Get('driver-info')
  @Roles('driver')
  getInfoDriver(@CurrentAcc() account: Account) {
    return account;
  }

  @Get('admin-info')
  @Roles('admin')
  getInfoAdmin(@CurrentAcc() account: Account) {
    return account;
  }

  // Api để đăng ký tài khoản cho user nếu chưa có tài khoản user
  @Permit()
  @Post('register')
  register(@Body() register: RegisterDto) {
    return this.authService.register(register);
  }

  // Api để đăng ký tài khoản cho tài xế nếu chưa có tài khoản user
  @Permit()
  @Post('register/driver')
  registerDriver(@Body() register: RegisterDriverDto) {
    return this.authService.registerDriver(register);
  }

  // Api để đăng ký tài khoản cho tài xế nếu chưa có tài khoản user
  @Post('user/register/driver')
  @Roles('user')
  registerDriverByUser(
    @CurrentAcc() userAccount: Account,
    @Body() register: RegisterDriverByUserDto,
  ) {
    return this.authService.registerDriverByUser(userAccount, register);
  }

  @Permit()
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() login: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(login);
    //one day
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    res.cookie('access_token', token, {
      httpOnly: true,
      expires,
    });
    return token;
  }
}
