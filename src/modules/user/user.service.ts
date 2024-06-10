import { Injectable } from '@nestjs/common';
import { PagingResponseDto } from '~/common/dto/paging-response.dto';
import { UserRepository } from '~/repositories/user.repository';
import { FindAllDto } from './dto/find-all.dto';
import { StatisticResponseDto } from './dto/statistic-response.dto';
import { IStatisticRecord } from './interfaces/statistic.interface';
import { ActionUserDto } from '~/modules/user/dto/action-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findAll(findAllDto: FindAllDto) {
    const [users, count] = await this.userRepository.findAndCount({
      where: {},
      skip: findAllDto.skip,
      take: findAllDto.take,
      order: { [findAllDto.sort]: findAllDto.order },
      relations: ['car'],
    });
    return new PagingResponseDto(users, count, findAllDto);
  }

  async getStatistic() {
    const results = await this.userRepository.query<IStatisticRecord>(
      'select count(*) as count, activate_status activateStatus from users u group by activateStatus',
    );
    return new StatisticResponseDto(results);
  }

  async action(id: number, actionUserDto: ActionUserDto) {
    return this.userRepository.update(
      { id },
      { activateStatus: actionUserDto.status },
    );
  }
}
