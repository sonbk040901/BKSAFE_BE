import { Body, Get, HttpCode, Patch, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Permit } from '~decors/meta/permit.decorator';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { Account } from '~entities/account.entity';
import { LoginDto } from './dto/login.dto';
import { Roles } from '~decors/meta/roles.decorator';
import { RegisterDriverByUserDto } from '@auth/dto/register-driver-by-user.dto';
import { Response } from 'express';
import { ActiveUserDto } from '@auth/dto/active-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserCtrl } from '~decors/controller/controller.decorator';

@ApiTags('user/auth')
@UserCtrl('auth')
export class AuthUserController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getInfo(@CurrentAcc() account: Account) {
    return account;
  }

  @Permit()
  @Post('register')
  register(@Body() register: RegisterDto) {
    return this.authService.register(register);
  }

  // Api để đăng ký tài khoản cho tài xế nếu đã có tài khoản người dùng
  @Post('register/driver')
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
      domain: process.env.COOKIE_DOMAIN || 'localhost',
    });
    return token;
  }

  @Permit()
  @Patch('active')
  async activeUser(@Body() activeUserDto: ActiveUserDto) {
    return this.authService.active(activeUserDto);
  }
}
