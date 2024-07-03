import { IsNumber, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  message: string;
  @IsNumber()
  to: number;
}
