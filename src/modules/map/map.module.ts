import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapUserController } from './map.user.controller';
import { RepositoriesModule } from '~repos/repositories.module';
import { UtilsModule } from '~utils/utils.module';

@Module({
  imports: [RepositoriesModule, UtilsModule],
  controllers: [MapUserController],
  providers: [MapService],
})
export class MapModule {}
