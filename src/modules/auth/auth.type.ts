import { SignInProvider, UserRole } from '@/prisma/graphql';
import { ArgsType, Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserOnly } from '../user/user.type';
import { COUNTRY_CODE_DEFAULT, SITE_NAME } from '@/configs/constant';

export enum UserRoleWithoutAdmin {
  employee = UserRole.employee,
  employer = UserRole.employer
}
registerEnumType(UserRoleWithoutAdmin, {
  name: 'UserRoleWithoutAdmin'
});

@ArgsType()
export class LoginArgs {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ArgsType()
export class RegisterArgs {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  role: UserRoleWithoutAdmin;

  @Field({ nullable: true, defaultValue: COUNTRY_CODE_DEFAULT })
  countryCode: string;
}

@ArgsType()
export class RegisterEmployeeArgs {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true, defaultValue: COUNTRY_CODE_DEFAULT })
  countryCode: string;

  @Field()
  phoneNumber: string;
}

@ArgsType()
export class RegisterEmployerArgs {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true, defaultValue: COUNTRY_CODE_DEFAULT })
  countryCode: string;

  @Field()
  phoneNumber: string;

  @Field()
  companyName: string;

  @Field(() => [String])
  industryIds: string[];

  @Field()
  companyTypeId: string;

  @Field()
  cityId: number;

  @Field()
  addressDetail: string;
}

@ArgsType()
export class VerifyAccountArgs {
  @Field()
  verifyCode: string;

  @Field()
  userId: string;
}

@ArgsType()
export class ResendVerifyCodeArgs {
  @Field()
  userId: string;

  @Field()
  email: string;
}

@ArgsType()
export class ForgotPasswordArgs {
  @Field()
  email: string;
}

@ArgsType()
export class SavedPasswordChange {
  @Field()
  verifyCode: string;

  @Field()
  userId: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@ArgsType()
export class RefreshTokenArgs {
  @Field()
  refreshToken: string;
}

export class JwtPayload {
  @Field()
  id: string;

  @Field()
  isRefreshToken?: boolean;
}

@ObjectType()
export class LoginResult {
  @Field()
  accessToken: string;

  @Field()
  expireTime: Date;

  @Field()
  refreshToken: string;

  @Field(() => UserOnly, { nullable: true })
  profile?: UserOnly;
}

@ObjectType()
export class RefreshTokenResult {
  @Field()
  accessToken: string;

  @Field()
  expireTime: Date;
}

@InputType()
export class GoogleUserInfo {
  @Field()
  email: string;

  @Field()
  emailVerified: boolean;

  @Field({ nullable: true, defaultValue: SITE_NAME })
  familyName: string;

  @Field({ nullable: true, defaultValue: SITE_NAME })
  givenName: string;

  @Field({ nullable: true })
  locale: string;

  @Field({ nullable: true, defaultValue: SITE_NAME })
  name: string;

  @Field({ nullable: true })
  picture: string;

  @Field()
  sub: string;
}

@ArgsType()
export class LoginWithIdTokenArgs {
  @Field()
  idToken: string;

  @Field(() => UserRoleWithoutAdmin, {
    nullable: true,
    defaultValue: UserRoleWithoutAdmin.employee
  })
  role: UserRoleWithoutAdmin;

  @Field(() => SignInProvider, {
    nullable: true,
    defaultValue: SignInProvider.google
  })
  provider: SignInProvider;

  @Field({ nullable: true, defaultValue: COUNTRY_CODE_DEFAULT })
  countryCode: string;
}
