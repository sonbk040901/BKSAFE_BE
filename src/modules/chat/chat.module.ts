import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatUserController } from './chat.user.controller';
import { ChatGateway } from './chat.gateway';
import { ChatDriverController } from './chat.driver.controller';

@Module({
  controllers: [ChatUserController, ChatDriverController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
