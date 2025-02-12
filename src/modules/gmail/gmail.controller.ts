import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/AuthGuard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Role } from '../auth/roles.enum';

@ApiTags('Configuración Gmail Api')
@Controller('gmail')
export class GmailController {
  private readonly logger = new Logger(GmailController.name);

  @ApiExcludeEndpoint() //? Comentar esta linea para activar el endpoint en swagger para poder activar la cuenta y su autorizacion. (Se debe hacer solo una vez)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('generate-token')
  async generateToken() {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.REDIRECT_URI,
    );

    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/gmail.send',
      ],
    });

    this.logger.log('Autoriza esta app visitando esta URL: ', authUrl);
    return { message: 'Visita esta URL para autorizar la app', url: authUrl };
  }

  @ApiExcludeEndpoint()
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('oauth2callback')
  async handleCallback(@Query('code') code: string) {
    if (!code) {
      throw new Error('No se recibió un código de autorización.');
    }

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.REDIRECT_URI,
    );

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Guarda el token en un archivo o base de datos
    fs.writeFileSync('gmail-token.json', JSON.stringify(tokens, null, 2));
    this.logger.log('Token almacenado exitosamente.');

    return { message: 'Token generado y almacenado correctamente', tokens };
  }

  @ApiExcludeEndpoint()
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('send-email')
  async sendEmail() {
    try {
      // Leer el token desde el archivo
      const tokenData = JSON.parse(fs.readFileSync('gmail-token.json', 'utf8'));

      // Crear un cliente OAuth2 con las credenciales y el token
      const oAuth2Client = new google.auth.OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        process.env.REDIRECT_URI,
      );
      oAuth2Client.setCredentials(tokenData);

      // Configurar Nodemailer con OAuth2
      const accessToken = await oAuth2Client.getAccessToken();
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.SMTP_USER, // Correo autorizado
          clientId: process.env.GMAIL_CLIENT_ID,
          clientSecret: process.env.GMAIL_CLIENT_SECRET,
          refreshToken: tokenData.refresh_token,
          accessToken: accessToken.token,
        },
      });

      // Opciones del correo
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: process.env.TEST_EMAIL_TO,
        subject: 'Prueba de envío de correo',
        text: 'Este es un correo de prueba enviado desde Gmail API con Nodemailer.',
        html: '<h1>¡Correo de Prueba!</h1><p>Este es un correo de prueba enviado desde Gmail API con Nodemailer.</p>',
      };

      // Enviar el correo
      const result = await transporter.sendMail(mailOptions);

      this.logger.log('Correo enviado exitosamente:', result);
      return { message: 'Correo enviado exitosamente', result };
    } catch (error) {
      this.logger.error('Error al enviar correo:', error);
      return { message: 'Error al enviar correo', error: error.message };
    }
  }
}
