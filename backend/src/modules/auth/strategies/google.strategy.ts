import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID, // ID client Google
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Secret client Google
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'], // Permissions demandées
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);
  console.log('Profile:', profile);
    const { id, displayName, emails, photos } = profile;

    const user = {
      provider: 'google',
      id,
      name: displayName,
      email: emails?.[0]?.value,
      photo: photos?.[0]?.value,
      accessToken,
    };

    done(null, user);
  }
}
