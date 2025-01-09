import { Controller, Get, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from './dto/signup.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async signup(@Body() signupDto: SignupDto) {
    return this.userService.signup(signupDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}
