import { AdminCtrl } from '~/common/decorators/controller/controller.decorator';
import { UserService } from './user.service';
import { Body, Get, Param, Patch, Query } from '@nestjs/common';
import { FindAllDto } from './dto/find-all.dto';
import { ApiTags } from '@nestjs/swagger';
import { ActionUserDto } from '~/modules/user/dto/action-user.dto';

@ApiTags('admin/users')
@AdminCtrl('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() findAllDto: FindAllDto) {
    return this.userService.findAll(findAllDto);
  }

  @Get('statistic')
  getStatistic() {
    return this.userService.getStatistic();
  }

  @Patch(':id/action')
  async action(@Param('id') id: number, @Body() actionUserDto: ActionUserDto) {
    return this.userService.action(id, actionUserDto);
  }
}
