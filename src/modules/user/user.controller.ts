import { AdminCtrl } from '~/common/decorators/controller/controller.decorator';
import { UserService } from './user.service';
import { Get, Query } from '@nestjs/common';
import { FindAllDto } from './dto/find-all.dto';

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
}
