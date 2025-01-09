import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../modules/user/user.module';
import { AuthModule } from '../modules/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/porthub'), // Remplacez par l'URI de votre base MongoDB
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
