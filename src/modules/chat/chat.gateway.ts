import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { BaseGateway } from '~/common/gateway/base.gateway';

@WebSocketGateway({ cors: '*', namespace: 'chat' })
export class ChatGateway extends BaseGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
