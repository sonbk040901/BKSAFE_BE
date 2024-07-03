import { Injectable } from '@nestjs/common';
import { ChatRepository } from '~repos/chat.repository';
import { DriverRepository } from '~repos/driver.repository';
import { camelCase } from '~utils/common';

@Injectable()
export class ChatService {
  constructor(
    private chatRepository: ChatRepository,
    private driverRepository: DriverRepository,
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
        chatId,
        message,
        createdAt,
        userId,
        driverId,
        isDriver: !!isDriver,
        driver: this.driverRepository.create(camelCase(driver)),
      };
    });
  }
}
