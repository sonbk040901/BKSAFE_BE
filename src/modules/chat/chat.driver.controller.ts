import { ChatService } from './chat.service';
import { DriverCtrl } from '~decors/controller/controller.decorator';
import { Get, Param } from '@nestjs/common';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('driver/chat')
@DriverCtrl('chats')
export class ChatDriverController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getChatChannels(@CurrentAcc('id') driverId: number) {
    return this.chatService.getChatChannelsByDriver(driverId);
  }

  @Get(':userId')
  async getChatMessages(
    @CurrentAcc('id') driverId: number,
    @Param('userId') userId: number,
  ) {
    return this.chatService.getChatMessagesByDriver(driverId, userId);
  }
}
