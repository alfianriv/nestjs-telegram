export class TelegramService {
  constructor(private readonly telegram) {}

  async sendMessage(chatId: number, text: string): Promise<void> {
    await this.telegram.sendMessage(chatId, text);
  }
}
