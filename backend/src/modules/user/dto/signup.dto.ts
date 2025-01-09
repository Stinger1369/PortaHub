import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Matches(/^\d{10}$/, { message: 'Invalid phone number. Must be 10 digits.' }) // Format de téléphone à 10 chiffres
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;

  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  lastName: string;
}
