import { Injectable } from '@nestjs/common';
import { PagingResponseDto } from '~/common/dto/paging-response.dto';
import { AccountRepository } from '~/repositories/account.repository';
import { UserRepository } from '~/repositories/user.repository';
import { FindAllDto } from './dto/find-all.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private accountRepository: AccountRepository,
  ) {}

  async findAll(findAllDto: FindAllDto) {
    const [users, count] = await this.userRepository.findAndCount({
      where: {},
      skip: findAllDto.skip,
      take: findAllDto.take,
      order: { [findAllDto.sort]: findAllDto.order },
      relations: ['account', 'car'],
    });
    const usersWithAccount = users.map((user) => {
      const { account, ...rest } = user;
      const accountPlain = instanceToPlain(account);
      Object.assign(rest, accountPlain);
      return rest;
    });
    return new PagingResponseDto(usersWithAccount, count, findAllDto);
  }

  async getStatistic() {
    const results: { isActivated: boolean; count: string }[] =
      await this.userRepository.query(
        'select count(*) as count, is_activated isActivated from users u inner join accounts a on u.id = a.id group by is_activated;',
      );
    return {
      active: +(results.find((result) => result.isActivated)?.count || 0),
      inactive: +(results.find((result) => !result.isActivated)?.count || 0),
      total: results.reduce((acc, cur) => +cur.count + acc, 0),
    };
  }
}
