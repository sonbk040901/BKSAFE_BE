import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role } from '~entities/role.entity';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }

  async getUserRole() {
    const role = await this.findOne({ where: { name: 'user' } });
    return role!;
  }

  async getDriverRole() {
    const role = await this.findOne({ where: { name: 'driver' } });
    return role!;
  }
}
