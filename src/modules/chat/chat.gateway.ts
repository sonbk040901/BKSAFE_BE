import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { BaseGateway } from '~/common/gateway/base.gateway';
import { AuthService } from '@auth/auth.service';
import { ChatService } from '~/modules/chat/chat.service';

@WebSocketGateway({ cors: '*', namespace: 'chat' })
export class ChatGateway extends BaseGateway {
  constructor(
    authService: AuthService,
    private chatService: ChatService,
  ) {
    super(authService);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
