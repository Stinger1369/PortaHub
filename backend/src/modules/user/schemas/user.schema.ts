import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class HistoryEntry {
  @Prop({ required: true })
  action: 'signup' | 'login' | 'logout'; // Action effectuée

  @Prop({ required: true })
  timestamp: Date; // Date et heure de l'action
}

@Schema()
export class Address {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  postalCode: string;
}

@Schema()
export class User extends Document {
  @Prop({ required: false })
  firstName?: string;

  @Prop({ required: false })
  lastName?: string;

  @Prop()
  secondName?: string; // Optionnel

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: function () { return !this.provider; } }) // Mot de passe requis uniquement si aucun fournisseur OAuth
  password?: string;

  @Prop()
  phone?: string; // Numéro de téléphone (optionnel)

  @Prop({ type: Date })
  birthday?: Date; // Date de naissance

  @Prop({ default: Date.now })
  createdAt: Date; // Date de création du compte

  @Prop({ type: Date })
  lastLogin?: Date; // Dernière connexion

  @Prop({ type: Date })
  lastLogout?: Date; // Dernière déconnexion

  @Prop({ default: false })
  isActive: boolean; // Indique si l'utilisateur est connecté

  @Prop({ type: Address, _id: false })
  address?: Address; // Adresse complète de l'utilisateur

  @Prop()
  profilePicture?: string; // URL de la photo de profil

  @Prop({ default: [] })
  history: HistoryEntry[]; // Historique des actions utilisateur

  @Prop({ type: String, default: null })
  validationCode?: string;

  @Prop({ type: Date, default: null })
  validationCodeExpiration?: Date;

  @Prop()
  provider?: string; // OAuth Provider (google, github, linkedin)

  @Prop()
  providerId?: string; // ID utilisateur fourni par le fournisseur OAuth

  // Typage explicite de l'ID
  _id: Types.ObjectId; // Ajout pour résoudre les problèmes avec _id dans user.service.ts
}

export const UserSchema = SchemaFactory.createForClass(User);
