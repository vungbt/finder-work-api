import { Args, Context, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { UserOnly } from '../user/user.type';
import { AuthService } from './auth.service';
import {
  ForgotPasswordArgs,
  LoginArgs,
  LoginResult,
  LoginWithIdTokenArgs,
  RefreshTokenArgs,
  RefreshTokenResult,
  RegisterArgs,
  RegisterEmployeeArgs,
  RegisterEmployerArgs,
  ResendVerifyCodeArgs,
  SavedPasswordChange,
  VerifyAccountArgs
} from './auth.type';
import { AuthRoles } from './passport/jwt/jwt.decorator';
import { Country } from '@/prisma/graphql';
import { IDataloaders } from '../common/dataloader/dataloader.type';

@Resolver(() => UserOnly)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResult, { name: 'auth_login' })
  async login(@Args() args: LoginArgs): Promise<LoginResult> {
    return this.authService.login(args);
  }

  @Mutation(() => LoginResult, { name: 'auth_login_with_google' })
  async loginWithGoogle(@Args() args: LoginWithIdTokenArgs): Promise<LoginResult> {
    return this.authService.loginWithGoogle(args);
  }

  @Mutation(() => UserOnly, { name: 'auth_register' })
  @AuthRoles({ roles: [UserRole.admin] })
  async register(@Args() args: RegisterArgs): Promise<UserOnly> {
    return this.authService.register(args);
  }

  @Mutation(() => UserOnly, { name: 'auth_employee_register' })
  async employeeRegister(@Args() args: RegisterEmployeeArgs): Promise<UserOnly> {
    return this.authService.registerEmployee(args);
  }

  @Mutation(() => UserOnly, { name: 'auth_employer_register' })
  async employerRegister(@Args() args: RegisterEmployerArgs): Promise<UserOnly> {
    return this.authService.registerEmployer(args);
  }

  @Mutation(() => UserOnly, { name: 'auth_verify_account' })
  async verifyAccount(@Args() args: VerifyAccountArgs): Promise<UserOnly> {
    return this.authService.verifyAccount(args);
  }

  @Mutation(() => UserOnly, { name: 'auth_resend_verify_code' })
  async resendVerifyCode(@Args() args: ResendVerifyCodeArgs): Promise<UserOnly> {
    return this.authService.resendVerifyCode(args);
  }

  @Mutation(() => Boolean, { name: 'auth_request_forgot_password' })
  async forgotPassword(@Args() args: ForgotPasswordArgs): Promise<boolean> {
    return this.authService.requestForgotPassword(args);
  }

  @Mutation(() => UserOnly, { name: 'auth_saved_password' })
  async savedPassword(@Args() args: SavedPasswordChange): Promise<UserOnly> {
    return this.authService.savedPasswordChange(args);
  }

  @Mutation(() => RefreshTokenResult, {
    name: 'auth_refresh_token'
  })
  async refreshToken(@Args() args: RefreshTokenArgs): Promise<RefreshTokenResult> {
    return this.authService.refreshToken(args.refreshToken);
  }

  @ResolveField(() => Country)
  country(@Parent() user: UserOnly, @Context() { loaders }: { loaders: IDataloaders }) {
    if (!user.countryId) return null;
    return loaders.countryUnique.load(user.countryId);
  }
}
