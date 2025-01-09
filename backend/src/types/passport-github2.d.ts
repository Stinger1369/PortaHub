declare module 'passport-github2' {
  import { Strategy as PassportStrategy } from 'passport';

  interface GitHubProfile {
    id: string;
    displayName: string;
    username: string;
    emails?: { value: string }[];
    photos?: { value: string }[];
  }

  interface GitHubStrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
  }

  type VerifyCallback = (
    accessToken: string,
    refreshToken: string,
    profile: GitHubProfile,
    done: (error: any, user?: any) => void,
  ) => void;

  export class Strategy extends PassportStrategy {
    constructor(options: GitHubStrategyOptions, verify: VerifyCallback);
  }
}
