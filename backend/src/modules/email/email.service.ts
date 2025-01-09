import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement depuis .env

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // Serveur SMTP
      port: parseInt(process.env.SMTP_PORT, 10), // Port SMTP
      secure: process.env.SMTP_SECURE === 'true', // SSL/TLS
      auth: {
        user: process.env.SMTP_USER, // Adresse email
        pass: process.env.SMTP_PASS, // Mot de passe
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"PORTAHUB" <${process.env.SMTP_USER}>`, // Nom et adresse de l'expéditeur
      to, // Destinataire
      subject, // Sujet
      text, // Contenu texte
      html, // Contenu HTML
    });
  }
}
