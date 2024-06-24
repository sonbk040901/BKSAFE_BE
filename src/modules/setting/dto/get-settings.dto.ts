import { PartialType } from '@nestjs/mapped-types';
import { UpdateSettingsDto } from './update-setting.dto';
export class GetSettingsDto extends PartialType(UpdateSettingsDto) {
  constructor(settings: Record<string, unknown>) {
    super();
    this.apiKey = settings.google_maps_api_key as string;
    this.autoFindDriver = settings.auto_find_driver as boolean;
    this.hotline = settings.hotline as string;
  }
}
