import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement depuis .env

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Vérifier que les variables d'environnement nécessaires sont définies
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      throw new Error('SMTP configuration is missing. Please check your .env file.');
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost, // Serveur SMTP
      port: parseInt(smtpPort, 10), // Port SMTP
      secure: process.env.SMTP_SECURE === 'true', // SSL/TLS
      auth: {
        user: smtpUser, // Adresse email
        pass: smtpPass, // Mot de passe
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
