import { ChatService } from './chat.service';
import { UserCtrl } from '~decors/controller/controller.decorator';

@UserCtrl('chats')
export class ChatUserController {
  constructor(private readonly chatService: ChatService) {}
}
