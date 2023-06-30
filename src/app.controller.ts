import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getTop3Exchanges(): string {
    return `Hello world`;
  }
}
