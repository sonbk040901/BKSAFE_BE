import { ActiveUserDto } from '@auth/dto/active-user.dto';
import { RegisterDriverByUserDto } from '@auth/dto/register-driver-by-user.dto';
import { Body, Get, HttpCode, Patch, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserCtrl } from '~decors/controller/controller.decorator';
import { Permit } from '~decors/meta/permit.decorator';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { Account } from '~entities/account.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

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
  registerDriverByUser(
    @CurrentAcc() userAccount: Account,
    @Body() register: RegisterDriverByUserDto,
  ) {
    return this.authService.registerDriverByUser(userAccount, register);
  }

  @Get('register/driver/check')
  checkDriverRegisterStatus(@CurrentAcc() userAccount: Account) {
    return this.authService.checkDriverRegisterStatus(userAccount);
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
      sameSite: 'lax',
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
