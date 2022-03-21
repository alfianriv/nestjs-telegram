import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import * as TelegramBot from 'node-telegram-bot-api';

export class TelegramServer extends Server implements CustomTransportStrategy {
  private bot;

  constructor(private readonly token: string) {
    super();
  }

  async listen(callback: () => void) {
    this.logger.log('Telegram client is listening for messages');
    this.bot = new TelegramBot(this.token, { polling: true });

    this.bindEventHandlers();
    callback();
  }

  close() {
    return;
  }

  private async bindEventHandlers() {
    this.bot.on('message', async (msg) => {
      this.logger.log(`Received message from ${msg.chat.id}`);
      try {
        const handler = this.getHandlerByPattern('message');
        const data = msg;
        const context = {
          data,
          message: msg.text,
        };
        const stream = this.transformToObservable(await handler(data, context));
        this.send(stream, () => null);
      } catch (error) {
        this.logger.error(`Get message '${msg.text}' but no handler found`);
      }
    });
  }

  sendMessage(chatId, message) {
    return this.bot.sendMessage(chatId, message);
  }
}
