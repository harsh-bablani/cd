import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Clinic Front Desk API is running!';
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      message: 'Clinic Front Desk API is healthy',
      timestamp: new Date().toISOString()
    };
  }
}
