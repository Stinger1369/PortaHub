import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID, // ID client GitHub
      clientSecret: process.env.GITHUB_CLIENT_SECRET, // Secret client GitHub
      callbackURL: process.env.GITHUB_CALLBACK_URL, // URL de callback
      scope: ['user:email'], // Permissions demandées
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
    const { id, displayName, username, emails, photos } = profile;

    const user = {
      provider: 'github',
      id,
      name: displayName || username,
      email: emails?.[0]?.value,
      photo: photos?.[0]?.value,
      accessToken,
    };

    done(null, user);
  }
}
