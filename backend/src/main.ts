import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activer CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Autoriser votre frontend
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Méthodes HTTP autorisées
    allowedHeaders: 'Content-Type, Authorization', // En-têtes autorisés
    credentials: true, // Permet les cookies et les identifiants
  });

  // Ajout d'un pipeline global de validation
  app.useGlobalPipes(
    new ValidationPipe({
      // Transforme les objets selon les DTO
      transform: true,
      // Supprime les propriétés non attendues
      whitelist: true,
      // Rejette les requêtes contenant des propriétés non attendues
      forbidNonWhitelisted: true,
      // Arrête immédiatement en cas d'erreurs de validation
      stopAtFirstError: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
