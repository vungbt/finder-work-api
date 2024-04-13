import { DEFAULT_COLOR, DEFAULT_PHONE, SITE_NAME, SOCIAL_SITE } from '@/configs/constant';
import { AppConfig } from '@/configs/type';
import { PrismaService } from '@/prisma/prisma.service';
import { comparePassword, hashPassword, strGenerate } from '@/utils/helpers';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@prisma/client';
import { add } from 'date-fns';
import slug from 'slug';
import { UserService } from '../user/user.service';
import {
  ForgotPasswordArgs,
  JwtPayload,
  LoginArgs,
  LoginResult,
  LoginWithIdTokenArgs,
  RefreshTokenResult,
  RegisterArgs,
  RegisterEmployeeArgs,
  RegisterEmployerArgs,
  ResendVerifyCodeArgs,
  SavedPasswordChange,
  VerifyAccountArgs
} from './auth.type';
import { I18nService } from 'nestjs-i18n';
import { AddressService } from '../address/address.service';
import { OAuth2Client } from 'google-auth-library';
import { EmailSendingProducer } from '../common/queue/producer/email-sending.producer';

@Injectable()
export class AuthService {
  private accessTokenExpiresIn: number;
  private refreshTokenExpiresIn: number;
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfig>,
    private readonly userService: UserService,
    private readonly addressService: AddressService,
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
    private readonly emailSendingProducer: EmailSendingProducer
  ) {
    this.accessTokenExpiresIn = this.configService.get<number>('JWT_EXPIRES_IN');
    this.refreshTokenExpiresIn = this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRES_IN');
    this.googleClient = new OAuth2Client({
      clientId: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: this.configService.get<string>('GOOGLE_CLIENT_SECRET')
    });
  }

  async login(args: LoginArgs): Promise<LoginResult> {
    try {
      const user = await this.userService.findFirst({
        where: {
          email: {
            equals: args.email
          },
          emailVerified: true,
          status: 'active'
        }
      });

      if (!user)
        throw new HttpException(
          { key: 'validation.invalid', args: { label: this.i18n.t('common.user.title') } },
          HttpStatus.BAD_REQUEST
        );

      if (user.signInProvider)
        throw new HttpException(
          { key: 'error.email_registered_with', args: { provider: user.signInProvider } },
          HttpStatus.BAD_REQUEST
        );

      // compare password
      const isPassword = comparePassword(args.password, user.password);
      if (!isPassword)
        throw new HttpException(
          { key: 'validation.incorrect', args: { label: this.i18n.t('common.password.title') } },
          HttpStatus.BAD_REQUEST
        );

      return {
        accessToken: this.jwtService.sign({
          id: user.id,
          role: user.role
        }),
        expireTime: add(new Date(), {
          seconds: this.accessTokenExpiresIn
        }),
        refreshToken: this.jwtService.sign(
          {
            id: user.id,
            isRefreshToken: true
          },
          {
            expiresIn: this.refreshTokenExpiresIn
          }
        ),
        profile: user
      };
    } catch (error) {
      throw error;
    }
  }

  async loginWithGoogle(args: LoginWithIdTokenArgs): Promise<LoginResult> {
    try {
      const { idToken, provider, role, countryCode } = args;

      const loginTicket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID')
      });
      const { email, sub, given_name, family_name, picture } = loginTicket.getPayload();

      // get first user match with email
      let user = await this.userService.findFirst({
        where: {
          email
        }
      });

      if (!user) {
        // get country by country code
        const country = await this.addressService.findFirstCountry({
          where: { iso2: String(countryCode).toUpperCase() }
        });

        const hashedPassword = hashPassword(sub); // random password with sub
        user = await this.userService.create({
          data: {
            email,
            role,
            avatarUrl: picture,
            password: hashedPassword,
            firstName: given_name,
            lastName: family_name,
            signInProvider: provider,
            emailVerified: true,
            phoneNumber: DEFAULT_PHONE.number,
            color: DEFAULT_COLOR,
            country: {
              connect: { id: country.id }
            }
          }
        });
      } else {
        await this.userService.update({
          where: { id: user.id },
          data: { emailVerified: true, verifyCode: null, status: 'active' }
        });
      }

      return {
        accessToken: this.jwtService.sign({
          id: user.id,
          role: user.role
        }),
        expireTime: add(new Date(), {
          seconds: this.accessTokenExpiresIn
        }),
        refreshToken: this.jwtService.sign(
          {
            id: user.id,
            isRefreshToken: true
          },
          {
            expiresIn: this.refreshTokenExpiresIn
          }
        ),
        profile: user
      };
    } catch (error) {
      throw error;
    }
  }

  async registerEmployee(args: RegisterEmployeeArgs): Promise<User> {
    try {
      const { email, password, countryCode, ...reset } = args;
      await this.isUserValid(email);

      return this.prismaService.$transaction(async (prisma) => {
        // get country by country code
        const country = await prisma.country.findFirst({
          where: { iso2: String(countryCode).toUpperCase() }
        });
        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
          data: {
            ...reset,
            email: email,
            password: hashedPassword,
            role: UserRole.employee,
            color: DEFAULT_COLOR,
            status: 'inactive',
            country: {
              connect: { id: country.id }
            }
          }
        });

        // send verify code to client email
        await this.sendVerifyCodeToClient(newUser.id, email);

        return newUser;
      });
    } catch (error) {
      throw error;
    }
  }

  async registerEmployer(args: RegisterEmployerArgs): Promise<User> {
    try {
      const {
        email,
        password,
        companyName,
        companyTypeId,
        industryIds,
        cityId,
        addressDetail,
        countryCode,
        ...reset
      } = args;

      // Check if the user is valid
      await this.isUserValid(email);

      // Use a transaction to perform multiple database operations atomically
      return this.prismaService.$transaction(async (prisma) => {
        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a slug for the company
        const companySlug = slug(companyName);

        // Create a new company
        const newCompany = await prisma.company.create({
          data: {
            name: companyName,
            slug: companySlug,
            type: {
              connect: { id: companyTypeId }
            },
            address: {
              connect: { id: cityId }
            },
            addressDetail
          }
        });

        // get country by country code
        const country = await this.addressService.findFirstCountry({
          where: { iso2: String(countryCode).toUpperCase() }
        });

        // Create a new user
        const newUser = await prisma.user.create({
          data: {
            ...reset,
            email,
            password: hashedPassword,
            role: UserRole.employer,
            color: DEFAULT_COLOR,
            country: {
              connect: { id: country.id }
            }
          }
        });

        // Update industries & user with company
        await prisma.company.update({
          where: { id: newCompany.id },
          data: {
            industries: {
              connect: industryIds.map((item) => ({ id: item }))
            },
            user: {
              connect: { id: newUser.id }
            }
          }
        });

        // Update user to match with companies
        await prisma.user.update({
          where: { id: newUser.id },
          data: {
            companies: {
              connect: [{ id: newCompany.id }]
            }
          }
        });

        return newUser;
      });
    } catch (error) {
      throw error;
    }
  }

  async verifyAccount(args: VerifyAccountArgs): Promise<User> {
    try {
      const { verifyCode, userId } = args;
      return this.prismaService.$transaction(async (prisma) => {
        const user = await prisma.user.findFirst({
          where: {
            id: userId,
            emailVerified: false
          }
        });

        if (!user)
          throw new HttpException(
            { key: 'validation.invalid', args: { label: this.i18n.t('common.user.title') } },
            HttpStatus.BAD_REQUEST
          );

        // check verify code
        if (user && user.verifyCode !== verifyCode)
          throw new HttpException({ key: 'error.verify_code_invalid' }, HttpStatus.BAD_REQUEST);

        const userVerified = await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: true, verifyCode: null, status: 'active' }
        });
        return userVerified;
      });
    } catch (error) {
      throw error;
    }
  }

  async register(args: RegisterArgs): Promise<User> {
    try {
      // check user valid
      await this.isUserValid(args.email);

      // get country by country code
      const country = await this.addressService.findFirstCountry({
        where: { iso2: String(args.countryCode).toUpperCase() }
      });

      const hashedPassword = await hashPassword(args.password);
      const newUser = await this.userService.create({
        data: {
          firstName: SITE_NAME,
          lastName: String(args.role),
          email: args.email,
          emailVerified: true,
          role: args.role,
          password: hashedPassword,
          phoneNumber: '383007243',
          color: DEFAULT_COLOR,
          country: {
            connect: { id: country.id }
          }
        }
      });
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResult> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);
      if (payload.isRefreshToken) {
        return {
          accessToken: this.jwtService.sign({
            id: payload.id
          }),
          expireTime: add(new Date(), {
            seconds: this.accessTokenExpiresIn
          })
        };
      }
      throw new HttpException({ key: 'error.common' }, HttpStatus.INTERNAL_SERVER_ERROR);
    } catch (error) {
      throw new HttpException({ key: 'error.common' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async isUserValid(email: string) {
    try {
      // check user valid
      const user = await this.userService.findFirst({
        where: {
          email: {
            equals: email
          }
        }
      });

      // check user valid but email verify is false
      if (user && !user.emailVerified) {
        await this.sendVerifyCodeToClient(user.id, user.email);
        throw new HttpException({ key: 'error.user_not_verified' }, HttpStatus.CONFLICT);
      }

      if (user && user.emailVerified)
        throw new HttpException(
          { key: 'validation.valid', args: { label: this.i18n.t('common.user.title') } },
          HttpStatus.BAD_REQUEST
        );

      return user;
    } catch (error) {
      throw error;
    }
  }

  async sendVerifyCodeToClient(userId: string, email: string) {
    try {
      const verifyCode = strGenerate({ length: 6 });
      await this.userService.update({ where: { id: userId }, data: { verifyCode } });
      await this.emailSendingProducer.sendingCodeToVerify({
        to: email,
        subject: this.i18n.t('common.email_template.subject.verify_code'),
        context: {
          domainUrl: this.configService.get<string>('WEB_DOMAIN'),
          code: verifyCode,
          iconName: SITE_NAME,
          social: {
            facebook: SOCIAL_SITE.facebook,
            instagram: SOCIAL_SITE.instagram,
            tiktok: SOCIAL_SITE.tiktok
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async resendVerifyCode(args: ResendVerifyCodeArgs) {
    try {
      const { email, userId } = args;
      const user = await this.userService.findFirst({
        where: {
          email: {
            equals: email
          },
          id: userId,
          emailVerified: false,
          status: 'inactive'
        }
      });

      if (!user)
        throw new HttpException(
          { key: 'validation.invalid', args: { label: this.i18n.t('common.user.title') } },
          HttpStatus.BAD_REQUEST
        );

      await this.sendVerifyCodeToClient(user.id, user.email);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async requestForgotPassword(args: ForgotPasswordArgs) {
    try {
      const { email } = args;
      const user = await this.userService.findFirst({
        where: {
          email: {
            equals: email
          },
          emailVerified: true,
          status: 'active'
        }
      });

      if (!user)
        throw new HttpException(
          { key: 'validation.invalid', args: { label: this.i18n.t('common.user.title') } },
          HttpStatus.BAD_REQUEST
        );
      await this.sendVerifyCodeToClient(user.id, user.email);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async savedPasswordChange(args: SavedPasswordChange) {
    try {
      const { password, email, userId, verifyCode } = args;
      const user = await this.userService.findFirst({ where: { id: userId, email } });

      if (!user)
        throw new HttpException(
          { key: 'validation.invalid', args: { label: this.i18n.t('common.user.title') } },
          HttpStatus.BAD_REQUEST
        );

      // check verify code
      if (user && user.verifyCode !== verifyCode)
        throw new HttpException({ key: 'error.verify_code_invalid' }, HttpStatus.BAD_REQUEST);

      const hashedPassword = await hashPassword(password);
      const newUser = await this.userService.update({
        where: { id: userId, email },
        data: {
          password: hashedPassword
        }
      });
      return newUser;
    } catch (error) {
      throw error;
    }
  }
}
