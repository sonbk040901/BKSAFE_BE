import {
  IsBoolean,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateSettingsDto {
  @IsString()
  @IsOptional()
  apiKey?: string;
  @IsBoolean()
  @IsOptional()
  autoFindDriver?: boolean;
  @IsPhoneNumber('VN')
  @IsOptional()
  hotline?: string;
  get google_maps_api_key() {
    return this.apiKey;
  }

  get auto_find_driver() {
    return this.autoFindDriver;
  }
}
