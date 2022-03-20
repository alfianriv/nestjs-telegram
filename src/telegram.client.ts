import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import * as TelegramBot from 'node-telegram-bot-api';

export class TelegramClient extends Server implements CustomTransportStrategy {
  private bot;

  constructor(private readonly token: string) {
    super();
  }

  async listen(callback: () => void) {
    this.logger.log('Telegram client is listening for messages');
    this.bot = new TelegramBot(this.token);

    this.bindEventHandlers();
    callback();
  }

  close() {
    return;
  }

  private async bindEventHandlers() {
    this.bot.on('message', async (msg) => {
      this.logger.log(`Received message from ${msg.chat.id}`);
      const handler = this.getHandlerByPattern(msg.text);
      const data = this.parseMessage(msg);
      const context = {
        data,
        message: msg,
      };
      const stream = this.transformToObservable(await handler(data, context));
      this.send(stream, () => null);
    });
  }

  parseMessage(msg) {
    return JSON.parse(msg);
  }
}
