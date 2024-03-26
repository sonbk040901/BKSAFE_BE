import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { RepositoriesModule } from '~repos/repositories.module';
import { UtilsModule } from '~utils/utils.module';

@Module({
  imports: [RepositoriesModule, UtilsModule],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
