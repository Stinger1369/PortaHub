import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { Request } from 'express'; // Importer Request depuis express

// Étendre l'interface Request pour inclure les propriétés de l'utilisateur OAuth
interface OAuthRequest extends Request {
  user?: {
    email: string;
    name: string;
    provider: string;
    id: string;
    photo: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  // Authentification Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Google OAuth redirection
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: OAuthRequest) {
    if (!req.user) {
      throw new Error('User information is not available'); // Gérer le cas où req.user est undefined
    }

    const userDto = {
      email: req.user.email,
      firstName: req.user.name.split(' ')[0],
      lastName: req.user.name.split(' ')[1] || '',
      provider: req.user.provider,
      providerId: req.user.id,
      photo: req.user.photo,
    };

    const { user, accessToken } = await this.userService.signup(userDto);
    return { message: 'Authenticated successfully with Google', user, accessToken };
  }

  // Route pour démarrer l'authentification avec GitHub
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // Cette route déclenche GitHub OAuth
  }

  // Route de callback pour GitHub
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req: OAuthRequest) {
    if (!req.user) {
      throw new Error('User information is not available');
    }

    const userDto = {
      email: req.user.email,
      firstName: req.user.name.split(' ')[0],
      lastName: req.user.name.split(' ')[1] || '',
      provider: req.user.provider,
      providerId: req.user.id,
      photo: req.user.photo,
    };

    const { user, accessToken } = await this.userService.signup(userDto);
    return { message: 'Authenticated successfully with GitHub', user, accessToken };
  }

  // Route pour démarrer l'authentification avec LinkedIn
  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuth() {
    // Cette route déclenche LinkedIn OAuth
  }

  // Route de callback pour LinkedIn
  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuthRedirect(@Req() req: OAuthRequest) {
    if (!req.user) {
      throw new Error('User information is not available');
    }

    const userDto = {
      email: req.user.email,
      firstName: req.user.name.split(' ')[0],
      lastName: req.user.name.split(' ')[1] || '',
      provider: req.user.provider,
      providerId: req.user.id,
      photo: req.user.photo,
    };

    const { user, accessToken } = await this.userService.signup(userDto);
    return { message: 'Authenticated successfully with LinkedIn', user, accessToken };
  }
}
