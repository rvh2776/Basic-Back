import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { google } from 'googleapis';
import path from 'path';
import Handlebars from 'handlebars';

@Injectable()
export class NodemailerService {
  private readonly logger = new Logger(NodemailerService.name);
  private readonly tokenPath = 'gmail-token.json'; // Ruta del archivo de token

  // Método para determinar la ruta de las plantillas según el entorno

  private getTemplatePath(templateName: string): string {
    const isProduction = process.env.NODE_ENV === 'production';

    // Base path dinámico según el entorno
    const basePath = isProduction
      ? path.join(__dirname, 'templates') // En producción
      : path.join(process.cwd(), 'src', 'modules', 'nodemailer', 'templates'); // En desarrollo

    console.log('Cargando plantilla desde:', basePath);

    return path.join(basePath, `${templateName}.html`);
  }

  // Cargar y procesar las plantillas
  private loadTemplate(
    templateName: string,
    variables: Record<string, any>,
  ): string {
    try {
      const templatePath = this.getTemplatePath(templateName);
      const templateContent = fs.readFileSync(templatePath, 'utf8');
      const template = Handlebars.compile(templateContent);

      return template(variables); // Reemplaza las variables dinámicas
    } catch (error) {
      this.logger.error(
        `Error al cargar la plantilla ${templateName}:`,
        error.message,
      );
      throw new Error('No se pudo cargar la plantilla del email.');
    }
  }

  async sendEmailWithTemplate(
    to: string,
    subject: string,
    templateName: string,
    variables: Record<string, any>,
  ): Promise<void> {
    const html = this.loadTemplate(templateName, variables);

    await this.sendEmail(to, subject, '', html);
  }

  // Método para enviar correos
  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<void> {
    try {
      // Leer el token desde el archivo
      const tokenData = this.readToken();

      // Crear un cliente OAuth2 con las credenciales y el token
      const oAuth2Client = new google.auth.OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        process.env.REDIRECT_URI,
      );
      oAuth2Client.setCredentials(tokenData);

      // Renovar el accessToken
      const accessToken = await oAuth2Client.getAccessToken();

      // Configurar Nodemailer con OAuth2
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.SMTP_USER,
          clientId: process.env.GMAIL_CLIENT_ID,
          clientSecret: process.env.GMAIL_CLIENT_SECRET,
          refreshToken: tokenData.refresh_token,
          accessToken: accessToken.token,
        },
      });

      // Opciones del correo
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
        html,
      };

      // Enviar el correo
      const result = await transporter.sendMail(mailOptions);

      console.log('Correo enviado exitosamente:');
    } catch (error) {
      this.logger.error('Error al enviar el correo:', error.message);
      throw new Error(`Error al enviar el correo: ${error.message}`);
    }
  }

  // Método auxiliar para leer el token desde el archivo
  private readToken(): any {
    try {
      const tokenData = JSON.parse(fs.readFileSync(this.tokenPath, 'utf8'));
      this.logger.log('Token leído correctamente desde el archivo.');
      return tokenData;
    } catch (error) {
      this.logger.error(
        `Error al leer el archivo de token (${this.tokenPath}):`,
        error.message,
      );
      throw new Error('No se pudo leer el archivo de token.');
    }
  }
}
