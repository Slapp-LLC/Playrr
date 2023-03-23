import { ConfigFactory } from '@nestjs/config';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
// Load environment variables from appropriate .env file
dotenv.config({
  path: resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
});

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  jwtSecret: string;
  googleClientId: string;
  googleClientKey: string;
  smtpConfig: SmtpConfig;
}

export const config: ConfigFactory<DatabaseConfig> = () => ({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  jwtSecret: process.env.JWT_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientKey: process.env.GOOGLE_CLIENT_KEY,
  smtpConfig: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  },
});
