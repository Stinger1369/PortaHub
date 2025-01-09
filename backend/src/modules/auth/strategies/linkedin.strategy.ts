import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor() {
    super({
      clientID: process.env.LINKEDIN_CLIENT_ID, // ID client LinkedIn
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET, // Secret client LinkedIn
      callbackURL: process.env.LINKEDIN_CALLBACK_URL, // URL de callback depuis le .env
      scope: ['r_emailaddress', 'r_liteprofile'], // Permissions demandées
      state: true, // Activer la vérification de l'état
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
    const { id, displayName, emails, photos } = profile;

    const user = {
      provider: 'linkedin',
      id,
      name: displayName,
      email: emails?.[0]?.value,
      photo: photos?.[0]?.value,
      accessToken,
    };

    done(null, user);
  }
}
