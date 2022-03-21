# NESTJS TELEGRAM
This module will capture all message from your telegram bot to your nestjs project, and you can send message with chat id.

## Installation

````shell
npm install nestjs-telegram
or 
yarn add nestjs-telegram
````

## Usage

### Listener

```typescript
// main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramServer } from 'nestjs-telegram';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const microservices = app.connectMicroservice({
    strategy: new TelegramServer(
      'your_bot_token',
    ),
  });

  Promise.all([microservices.listen(), app.listen(3000)]);
}
bootstrap();
```

### Subscriber handler

```typescript
// app.controller.ts
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('message')
  async handler(data) {
    return this.appService.handler(data);
  }
}
```

### Publisher

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramClient } from 'nestjs-telegram';

@Module({
  imports: [
    TelegramClient.forRootAsync({
      inject: [],
      useFactory: async () => ({
        token: 'your_bot_token',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

```typescript
// app.service.ts
import { Injectable } from '@nestjs/common';
import { TelegramService } from 'nestjs-telegram';

@Injectable()
export class AppService {
  constructor(private readonly telegram: TelegramService) {}

  handler(msg: any) {
    if (msg.text === '/start') {
      this.telegram.sendMessage(msg.chat.id, 'Hello, ' + msg.from.first_name);
    }
  }
}
```

### Support

Please support me if you like this module.

[![Donate](https://img.shields.io/badge/$-donate-ff69b4.svg)](https://paypal.me/alfianriv)