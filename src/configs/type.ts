import { IsBooleanString, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

enum ENVIRONMENT {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  STAGING = 'staging'
}

export class AppConfig {
  @IsEnum(ENVIRONMENT)
  NODE_ENV: ENVIRONMENT;

  @IsNumber()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  FALLBACK_LANGUAGE: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsBooleanString()
  @IsNotEmpty()
  DATABASE_LOG: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET_KEY: string;

  @IsNumber()
  JWT_EXPIRES_IN: number;

  @IsNumber()
  JWT_REFRESH_TOKEN_EXPIRES_IN: number;

  @IsString()
  @IsNotEmpty()
  FIREBASE_CREDENTIAL: string;

  @IsString()
  @IsNotEmpty()
  FIREBASE_WEB_API_KEY: string;

  @IsString()
  @IsNotEmpty()
  FIREBASE_LOGIN_DATA_TEST: string;

  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  REDIS_PORT: number;

  @IsNumber()
  @IsNotEmpty()
  REDIS_TTL: number;

  @IsString()
  @IsNotEmpty()
  FILE_FOLDER_TEMP: string;

  @IsString()
  @IsNotEmpty()
  FILE_FOLDER_ASSETS: string;

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_NAME: string;

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_API_KEY: string;

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_API_SECRET: string;

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_DOMAIN: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  MAIL_HOST: string;

  @IsString()
  @IsNotEmpty()
  MAIL_USER: string;

  @IsString()
  @IsNotEmpty()
  MAIL_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  MAIL_FROM: string;

  @IsString()
  @IsNotEmpty()
  MAIL_TRANSPORT: string;

  @IsString()
  @IsNotEmpty()
  WEB_DOMAIN: string;
}
