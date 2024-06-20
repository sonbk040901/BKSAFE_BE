import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapUserController } from './map.user.controller';
import { RepositoriesModule } from '~repos/repositories.module';
import { UtilsModule } from '~utils/utils.module';
import { MapDriverController } from './map.driver.controller';
import { MapAdminController } from './map.admin.controller';

@Module({
  imports: [RepositoriesModule, UtilsModule],
  controllers: [MapUserController, MapDriverController, MapAdminController],
  providers: [MapService],
})
export class MapModule {}
