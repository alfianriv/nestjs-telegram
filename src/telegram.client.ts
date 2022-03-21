import { Module } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { TelegramService } from './telegram.service';
import { TELEGRAM_SERVER_OPTIONS } from './telegram.constants';

@Module({})
export class TelegramClient {
  static forRootAsync(options) {
    return {
      module: TelegramClient,
      global: options.global,
      imports: options.imports,
      providers: [
        this.createOptionProvider(options),
        this.createTelegramProvider(),
      ],
      exports: [TelegramService],
    };
  }

  private static createTelegramProvider() {
    return {
      provide: TelegramService,
      useFactory: (config) => {
        const bot = new TelegramBot(config.token);
        return new Promise((resolve) => {
          resolve(new TelegramService(bot));
        });
      },
      inject: [TELEGRAM_SERVER_OPTIONS],
    };
  }

  private static createOptionProvider(options) {
    return {
      provide: TELEGRAM_SERVER_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }
}
