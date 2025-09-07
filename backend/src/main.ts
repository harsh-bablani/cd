import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://*.vercel.app', // Allow all Vercel deployments
      'https://cd-git-main-harsh-bablanis-projects.vercel.app', // Your specific Vercel URL
      'https://cd-lemon.vercel.app', // Your new Vercel URL
      'https://clinic-front-desk.vercel.app' // Alternative Vercel URL
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend server running on http://localhost:${port}`);
}
bootstrap();
