import { ChatService } from './chat.service';
import { UserCtrl } from '~decors/controller/controller.decorator';
import { Get } from '@nestjs/common';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user/chats')
@UserCtrl('chats')
export class ChatUserController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getChatChannels(@CurrentAcc('id') id: number) {
    return this.chatService.getChatChannelsByUser(id);
  }
}
