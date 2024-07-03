import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { BaseGateway } from '~/common/gateway/base.gateway';
import { AuthService } from '@auth/auth.service';
import { ChatService } from '~/modules/chat/chat.service';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { Account } from '~entities/account.entity';
import { CreateChatDto } from './dto/create-chat.dto';

@WebSocketGateway({ cors: '*', namespace: 'chat' })
export class ChatGateway extends BaseGateway {
  constructor(
    authService: AuthService,
    private chatService: ChatService,
  ) {
    super(authService);
  }

  @SubscribeMessage('new-chat')
  async handleNewChat(
    @CurrentAcc() account: Account,
    @MessageBody() createChatDto: CreateChatDto,
  ) {
    const chat = await this.chatService.createChat(account, createChatDto);
    this.emitToUser(chat.userId, 'new-chat', chat);
    this.emitToDriver(chat.driverId, 'new-chat', chat);
  }
}
