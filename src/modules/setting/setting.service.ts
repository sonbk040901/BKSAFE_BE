import { Injectable } from '@nestjs/common';
import { SettingRepository } from '~/repositories/setting.repository';
import { UpdateSettingsDto } from './dto/update-setting.dto';
import { GetSettingsDto } from './dto/get-settings.dto';
enum SettingKey {
  GoogleMapsApiKey = 'google_maps_api_key',
  AutoFindDriver = 'auto_find_driver',
  Hotline = 'hotline',
}

export type Settings = {
  name: SettingKey;
  value: string;
};

@Injectable()
export class SettingService {
  private settings: Partial<Record<SettingKey, unknown>> = {};
  constructor(private settingRepository: SettingRepository) {
    this.initSettings();
  }
  private initSettings() {
    this.settingRepository
      .query<Settings>('SELECT name, value FROM settings')
      .then((result) => {
        this.settings = result.reduce((acc, { name, value }) => {
          const v = value === 'true' ? true : value === 'false' ? false : value;
          return { ...acc, [name]: v };
        }, {});
      });
  }

  updateSettings(settings: UpdateSettingsDto) {
    let query = 'REPLACE INTO settings(name, value) VALUES ';
    Object.keys(this.settings).forEach((key: SettingKey) => {
      if (settings[key]) {
        this.settings[key] = settings[key];
      }
      query += `('${key}', ?),`;
    });
    this.settingRepository.query(
      query.slice(0, -1),
      Object.values(this.settings),
    );
  }

  getSetting(key: SettingKey) {
    return this.settings[key];
  }

  getSettings() {
    return new GetSettingsDto(this.settings);
  }
}
