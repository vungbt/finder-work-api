import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { readFileSync } from 'fs';
import * as slug from 'slug';
import { formatDate } from './formatter';
export * from './formatter';
export * from './regex';

/**
 * compare input password during login
 * @param orgPassword
 * @param encryptedPassword
 * @returns
 */
export function comparePassword(orgPassword: string, encryptedPassword: string) {
  const isPassword = bcrypt.compareSync(orgPassword, encryptedPassword);
  return isPassword;
}

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

/**
 * create common response object for application
 * @param content
 * @param metadata
 * @returns
 */
export function responseHelper<T>(data: T, metadata?: any, code?: number) {
  const res = {
    statusCode: HttpStatus.OK,
    statusText: HttpStatus[200],
    data: null,
    metadata: undefined
  };

  res.data = data;
  res.metadata = metadata
    ? {
        ...metadata
      }
    : undefined;

  if (code) {
    res.statusCode = code;
    res.statusText = HttpStatus[code];
  }
  return res;
}

/**
 *
 * @param path
 * @returns
 */
export function readJsonFile<T = unknown>(path: string) {
  try {
    const file = readFileSync(path, 'utf8');
    return JSON.parse(file) as T;
  } catch (error) {
    return null;
  }
}

export type OptionStrGenerate = {
  length?: number;
  prefix?: string;
  suffix?: string;
  upCase?: boolean;
  lowerCase?: boolean;
};

/**
 *
 * @param options
 * @returns string
 */
export const strGenerate = (options?: OptionStrGenerate): string => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < (options?.length || 10); i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  if (options?.prefix) {
    result = `${options?.prefix}${result}`;
  }
  if (options?.suffix) {
    result = `${result}${options?.suffix}`;
  }
  if (options?.upCase && !options?.lowerCase) {
    result = result.toUpperCase();
  }
  if (options?.lowerCase && !options?.upCase) {
    result = result.toLowerCase();
  }
  return result;
};

/**
 *
 * @param name
 * @returns string
 */
export const genSlug = (name?: string) => {
  return slug(name || strGenerate({ length: 10, lowerCase: true }));
};

/**
 *
 * @param name
 * @returns string
 */
export const genFileName = (name?: string) => {
  return `${formatDate(new Date())}-${slug(name || strGenerate({ length: 10, lowerCase: true }))}`;
};
