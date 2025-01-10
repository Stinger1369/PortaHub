import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SignupDto } from './dto/signup.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async signup(@Body() signupDto: SignupDto) {
    return this.userService.signup(signupDto);
  }

  @Post('validate')
  async validateAccount(
    @Body() { email, validationCode }: { email: string; validationCode: string },
  ): Promise<{ message: string }> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (
      user.validationCode !== validationCode ||
      (user.validationCodeExpiration && new Date() > user.validationCodeExpiration)
    ) {
      throw new BadRequestException('Invalid or expired validation code');
    }

    // Assignez `undefined` au lieu de `null` pour correspondre au type des propriétés
    user.validationCode = undefined;
    user.validationCodeExpiration = undefined;

    await this.userService.updateUser(user);

    return { message: 'Account successfully validated' };
  }

  @Post('resend-validation-code')
  async resendValidationCode(@Body() { email }: { email: string }): Promise<{ message: string }> {
    return this.userService.resendValidationCode(email);
  }

  @Post('login')
  async login(
    @Body() { identifier, password }: { identifier: string; password: string },
  ): Promise<{ accessToken: string; isActive: boolean; email: string; userId: string }> {
    return this.userService.login(identifier, password);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any) {
    const userId = req.user.sub; // Le payload du JWT contient `sub`
    return this.userService.logout(userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.userService.findAll();
  }
}
