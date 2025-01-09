import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GitHubStrategy } from './strategies/github.strategy';
import { LinkedInStrategy } from './strategies/linkedin.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'qs6f4564fhgd6yk5jliu465uyi4lèl3er8rgf4',
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => UserModule), // Utilisation de forwardRef
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, GoogleStrategy, GitHubStrategy, LinkedInStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
