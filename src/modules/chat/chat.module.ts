import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatUserController } from './chat.user.controller';
import { ChatGateway } from './chat.gateway';
import { ChatDriverController } from './chat.driver.controller';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ChatUserController, ChatDriverController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
