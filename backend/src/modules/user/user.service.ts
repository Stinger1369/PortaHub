import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException ,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { SmsService } from '../sms/sms.service'; // Import du SmsService
import { randomBytes } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService, // Ajout du SmsService
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateUser(user: User): Promise<User> {
    return user.save();
  }
 async signup(userDto: any): Promise<{ user: User; accessToken: string }> {
  const {
    email,
    phone,
    password,
    firstName,
    lastName,
    provider,
    providerId,
    photo,
  } = userDto;

  // Vérifier si un utilisateur avec cet email existe déjà
  const existingUser = await this.userModel.findOne({ email }).exec();
  if (existingUser) {
    // Si un utilisateur existe et provient du même provider, pas de doublon
    if (existingUser.provider && existingUser.provider === provider) {
      throw new ConflictException('An account with this email already exists for this provider.');
    }
    // Permet de mettre à jour les informations pour un fournisseur OAuth existant
    if (existingUser.providerId === providerId) {
      const updatedUser = await this.updateUser(existingUser);
      const payload = { email: updatedUser.email, sub: updatedUser._id };
      const accessToken = this.jwtService.sign(payload);
      return { user: updatedUser, accessToken };
    }
    throw new ConflictException('An account with this email already exists.');
  }

  let newUser;

  // Cas : Inscription via un fournisseur tiers (Google, GitHub, LinkedIn)
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
    // Cas : Inscription classique
    if (!phone || !password) {
      throw new BadRequestException('Phone and password are required for classic signup.');
    }

    // Vérification du numéro de téléphone
    if (!this.smsService.isFrenchPhoneNumber(phone)) {
      throw new BadRequestException('Only French phone numbers are allowed.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    newUser = new this.userModel({
      email,
      phone,
      password: hashedPassword,
      firstName,
      lastName,
      createdAt: new Date(),
      history: [{ action: 'signup', timestamp: new Date() }],
    });
  }

  const savedUser = await newUser.save();

  // Envoyer un email de bienvenue
  const subject = 'Welcome to our platform!';
  const text = `Hello ${firstName || lastName || 'User'}, welcome to our platform.`;
  const html = `<p>Hello ${firstName || lastName || 'User'},</p><p>Welcome to our platform.</p>`;
  await this.emailService.sendEmail(email, subject, text, html);

  // Générer le token JWT
  const payload = { email: savedUser.email, sub: savedUser._id };
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

  const smsMessage = `Hello ${user.firstName}, your new validation code is: ${validationCode}`;
  await this.smsService.sendSms(user.phone, smsMessage); // Passer `user.phone` et `smsMessage`

  return { message: 'A new validation code has been sent.' };
}
async login(
  identifier: string,
  password: string,
): Promise<{ accessToken: string; isActive: boolean; email: string; userId: string }> {
  // Vérification pour trouver l'utilisateur par email ou téléphone
  const user = await this.userModel.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  }).exec(); // Ajout de .exec() pour les requêtes Mongoose

  if (!user) {
    throw new Error('Invalid email/phone or password');
  }

  // Vérifier si le compte a été validé
  if (user.validationCode || user.validationCodeExpiration) {
    throw new Error('Account not validated. Please validate your account or request a new validation code.');
  }

  // Vérifier la validité du mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email/phone or password');
  }

  // Mettre à jour les informations de connexion
  user.lastLogin = new Date();
  user.isActive = true;

  user.history.push({
    action: 'login',
    timestamp: new Date(),
  });

  await user.save();

  // Générer le token JWT
  const payload = { email: user.email, sub: user._id };
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
