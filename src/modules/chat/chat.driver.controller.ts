import { ChatService } from './chat.service';
import { DriverCtrl } from '~decors/controller/controller.decorator';

@DriverCtrl('chats')
export class ChatDriverController {
  constructor(private readonly chatService: ChatService) {}
}
