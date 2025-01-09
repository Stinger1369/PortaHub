import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement

@Injectable()
export class SmsService {
  private readonly apiUrl = 'https://smsapi.free-mobile.fr/sendmsg';

  async sendSms(phone: string, message: string): Promise<void> {
    const user = process.env.FREE_MOBILE_USER; // Récupérer l'utilisateur depuis l'environnement
    const pass = process.env.FREE_MOBILE_PASS; // Récupérer la clé API depuis l'environnement

    if (!user || !pass) {
      throw new Error('Free Mobile API credentials are missing.');
    }

    // Vérification si le numéro est français
    if (!this.isFrenchPhoneNumber(phone)) {
      throw new BadRequestException('Only French phone numbers are allowed.');
    }

    if (!message || message.trim() === '') {
      throw new BadRequestException('Message content cannot be empty.');
    }

    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          user,
          pass,
          msg: `${message}`, // Personnalisation du message
        },
      });

      if (response.status === 200) {
        console.log('SMS envoyé avec succès via Free Mobile.');
      } else {
        console.error('Erreur lors de l\'envoi du SMS:', response.data);
        throw new Error(`Erreur SMS Free Mobile : ${response.data}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du SMS:', error.response?.data || error.message);
      throw new Error('L\'envoi du SMS a échoué.');
    }
  }

  /**
   * Vérifie si un numéro de téléphone est un mobile français.
   */
  isFrenchPhoneNumber(phone: string): boolean {
    const frenchPhoneRegex = /^(?:\+33|0)(6|7)\d{8}$/; // Mobile français uniquement
    return frenchPhoneRegex.test(phone);
  }
}
