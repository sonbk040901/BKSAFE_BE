import { Body, Get, HttpCode, Patch, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Permit } from '~decors/meta/permit.decorator';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { Account } from '~entities/account.entity';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { ActiveUserDto } from '@auth/dto/active-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { DriverCtrl } from '~decors/controller/controller.decorator';
import { RoleName } from '~/common/enums/role-name.enum';
import { RegisterDriverDto } from '@auth/dto/register-driver.dto';

@ApiTags('driver/auth')
@DriverCtrl('auth')
export class AuthDriverController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getInfo(@CurrentAcc() account: Account) {
    return account;
  }

  @Permit()
  @Post('register')
  register(@Body() register: RegisterDriverDto) {
    return this.authService.register(register, RoleName.DRIVER);
  }

  @Permit()
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() login: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(login, RoleName.DRIVER);
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
    return this.authService.active(activeUserDto, RoleName.DRIVER);
  }
}
