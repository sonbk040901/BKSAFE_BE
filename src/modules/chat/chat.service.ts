import { Injectable } from '@nestjs/common';
import { ChatRepository } from '~repos/chat.repository';
import { DriverRepository } from '~repos/driver.repository';
import { camelCase } from '~utils/common';
import { Account } from '~entities/account.entity';
import { CreateChatDto } from '~/modules/chat/dto/create-chat.dto';
import {
  DriverNotFoundException,
  UserNotFoundException,
} from '~exceptions/httpException';
import { UserRepository } from '~repos/user.repository';

@Injectable()
export class ChatService {
  constructor(
    private chatRepository: ChatRepository,
    private driverRepository: DriverRepository,
    private userRepository: UserRepository,
  ) {}

  async getChatChannelsByUser(userId: number) {
    const result: {
      chatId: number;
      message: string;
      createdAt: string;
      userId: string;
      driverId: string;
      isDriver: 0 | 1;
      [key: string]: any;
    }[] = await this.chatRepository.query(
      'SELECT c.id chatId, message, c.created_at createdAt, user_id userId, driver_id driverId, is_driver isDriver, d.*  FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY driver_id ORDER BY created_at DESC) as row_num FROM chats WHERE user_id = ?) AS c inner join drivers d on c.driver_id = d.id WHERE row_num = 1 order by c.created_at desc',
      [userId],
    );
    return result.map((r) => {
      const {
        chatId,
        message,
        createdAt,
        userId,
        driverId,
        isDriver,
        ...driver
      } = r;
      return {
        id: chatId,
        message,
        createdAt,
        userId,
        driverId,
        isDriver: !!isDriver,
        driver: this.driverRepository.create(camelCase(driver)),
      };
    });
  }

  async getChatMessagesByUser(userId: number, driverId: number) {
    const driver = await this.driverRepository.findOneBy({ id: driverId });
    if (!driver) throw new DriverNotFoundException();
    const chats = await this.chatRepository.find({
      where: {
        userId,
        driverId,
      },
    });
    return { driver, chats };
  }

  async getChatChannelsByDriver(driverId: number) {
    const result: {
      chatId: number;
      message: string;
      createdAt: string;
      userId: string;
      driverId: string;
      isDriver: 0 | 1;
      [key: string]: any;
    }[] = await this.chatRepository.query(
      'SELECT c.id chatId, message, c.created_at createdAt, user_id userId, driver_id driverId, is_driver isDriver, d.*  FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY driver_id ORDER BY created_at DESC) as row_num FROM chats WHERE driver_id = ?) AS c inner join users d on c.user_id = d.id WHERE row_num = 1 order by c.created_at desc',
      [driverId],
    );
    return result.map((r) => {
      const {
        chatId,
        message,
        createdAt,
        userId,
        driverId,
        isDriver,
        ...driver
      } = r;
      return {
        id: chatId,
        message,
        createdAt,
        userId,
        driverId,
        isDriver: !!isDriver,
        driver: this.driverRepository.create(camelCase(driver)),
      };
    });
  }

  async getChatMessagesByDriver(driverId: number, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UserNotFoundException();
    const chats = await this.chatRepository.find({
      where: {
        userId,
        driverId,
      },
    });
    return { user, chats };
  }

  async createChat(account: Account, createChatDto: CreateChatDto) {
    const isDriver = account.isDriver();
    const chat = this.chatRepository.create({
      message: createChatDto.message,
      userId: isDriver ? createChatDto.to : account.id,
      driverId: isDriver ? account.id : createChatDto.to,
      isDriver,
    });
    return this.chatRepository.save(chat);
  }
}
