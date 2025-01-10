import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { SmsService } from '../sms/sms.service';
import { randomBytes } from 'crypto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateUser(user: User): Promise<User> {
    return user.save();
  }

  async signup(userDto: any): Promise<{ user: User; accessToken: string }> {
    const { email, phone, password, firstName, lastName, provider, providerId, photo } = userDto;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      if (existingUser.provider && existingUser.provider === provider) {
        throw new ConflictException('An account with this email already exists for this provider.');
      }

      if (existingUser.providerId === providerId) {
        const updatedUser = await this.updateUser(existingUser);
        const payload = { email: updatedUser.email, sub: updatedUser._id.toString() };
        const accessToken = this.jwtService.sign(payload);
        return { user: updatedUser, accessToken };
      }
      throw new ConflictException('An account with this email already exists.');
    }

    let newUser;

    if (provider && providerId) {
      newUser = new this.userModel({
        email,
        provider,
        providerId,
        firstName: firstName || '',
        lastName: lastName || '',
        profilePicture: photo || '',
        createdAt: new Date(),
        history: [{ action: 'signup', timestamp: new Date() }],
      });
    } else {
      if (!phone || !password) {
        throw new BadRequestException('Phone and password are required for classic signup.');
      }

      if (!this.smsService.isFrenchPhoneNumber(phone)) {
        throw new BadRequestException('Only French phone numbers are allowed.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Générer un code de validation
      const validationCode = randomBytes(3).toString('hex').toUpperCase();

      newUser = new this.userModel({
        email,
        phone,
        password: hashedPassword,
        firstName,
        lastName,
        createdAt: new Date(),
        validationCode,
        validationCodeExpiration: new Date(Date.now() + 1000 * 60 * 15), // Expiration dans 15 minutes
        history: [{ action: 'signup', timestamp: new Date() }],
      });
    }

    const savedUser = await newUser.save();

    if (phone) {
      const smsMessage = `Hello ${firstName || lastName || 'User'}, welcome to our platform. Your validation code is: ${savedUser.validationCode}`;
      try {
        await this.smsService.sendSms(phone, smsMessage);
        console.log(`SMS envoyé avec succès à ${phone}`);
      } catch (error) {
        console.error(`Erreur lors de l'envoi du SMS à ${phone}:`, error.message);
      }
    }

    const subject = 'Welcome to our platform!';
    const text = `Hello ${firstName || lastName || 'User'}, welcome to our platform. Your validation code is: ${savedUser.validationCode}`;
    const html = `<p>Hello ${firstName || lastName || 'User'},</p><p>Welcome to our platform.</p><p>Your validation code is: <b>${savedUser.validationCode}</b></p>`;
    await this.emailService.sendEmail(email, subject, text, html);

    const payload = { email: savedUser.email, sub: savedUser._id.toString() };
    const accessToken = this.jwtService.sign(payload);

    return { user: savedUser, accessToken };
  }

  async resendValidationCode(email: string): Promise<{ message: string }> {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const validationCode = randomBytes(3).toString('hex').toUpperCase();
    user.validationCode = validationCode;
    user.validationCodeExpiration = new Date(Date.now() + 1000 * 60 * 15);
    await user.save();

    const subject = 'Resend your validation code';
    const text = `Hello ${user.firstName}, your new validation code is: ${validationCode}`;
    const html = `<p>Hello ${user.firstName},</p><p>Your new validation code is: <b>${validationCode}</b></p>`;
    await this.emailService.sendEmail(user.email, subject, text, html);

    if (user.phone) {
      const smsMessage = `Hello ${user.firstName}, your new validation code is: ${validationCode}`;
      await this.smsService.sendSms(user.phone, smsMessage);
    }

    return { message: 'A new validation code has been sent.' };
  }

 async login(
  identifier: string,
  password: string,
): Promise<{ accessToken: string; isActive: boolean; email: string; userId: string }> {
  const user = await this.userModel.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  }).exec();

  if (!user) {
    throw new Error('Invalid email/phone or password');
  }

  if (user.validationCode || user.validationCodeExpiration) {
    throw new Error('Account not validated. Please validate your account or request a new validation code.');
  }

  // Vérification que le mot de passe est défini
  if (!user.password) {
    throw new Error('Password is missing for this user');
  }

  // Comparaison des mots de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email/phone or password');
  }

  user.lastLogin = new Date();
  user.isActive = true;

  user.history.push({
    action: 'login',
    timestamp: new Date(),
  });

  await user.save();

  const payload = { email: user.email, sub: user._id.toString() };
  const accessToken = this.jwtService.sign(payload);

  return {
    accessToken,
    isActive: user.isActive,
    email: user.email,
    userId: user._id.toString(),
  };
}


  async logout(userId: string): Promise<{ isActive: boolean; message: string }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.lastLogout = new Date();
    user.isActive = false;

    user.history.push({
      action: 'logout',
      timestamp: new Date(),
    });

    await user.save();

    return {
      isActive: user.isActive,
      message: 'User successfully logged out',
    };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
