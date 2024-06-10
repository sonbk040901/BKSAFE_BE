import { Body, Get, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Permit } from '~decors/meta/permit.decorator';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { Account } from '~entities/account.entity';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AdminCtrl } from '~decors/controller/controller.decorator';
import { RoleName } from '~/common/enums/role-name.enum';

@ApiTags('admin/auth')
@AdminCtrl('auth')
export class AuthAdminController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getInfo(@CurrentAcc() account: Account) {
    return account;
  }

  @Permit()
  @Post('register')
  register(@Body() register: RegisterDto) {
    return this.authService.register(register, RoleName.ADMIN);
  }

  @Permit()
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() login: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(login, RoleName.ADMIN);
    //one day
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    res.cookie('access_token', token, {
      httpOnly: true,
      expires,
    });
    return token;
  }
}
