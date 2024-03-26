import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { RepositoriesModule } from '~repos/repositories.module';

@Module({
  imports: [RepositoriesModule],
  providers: [JwtStrategy],
  exports: [],
})
export class JwtAuthModule {}
