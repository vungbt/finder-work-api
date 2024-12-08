import {
  Company,
  DeleteOneCompanyArgs,
  FindFirstCompanyArgs,
  UpdateOneCompanyArgs
} from '@/prisma/graphql';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AllCompanyArgs, AllCompanyResult, CreateCompanyArgs } from './company.type';
import { CompanyService } from './company.service';
import { AuthRoles } from '../auth/passport/jwt/jwt.decorator';
import { UserRole } from '@prisma/client';
import { ContextType } from '@/types';

@Resolver(() => Company)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  @Mutation(() => Company, { name: 'create_company' })
  @AuthRoles({ roles: [UserRole.employer] })
  create(@Args() args: CreateCompanyArgs, @Context() ctx: ContextType) {
    return this.companyService.create(args, ctx.req.user);
  }

  @Mutation(() => Company, { name: 'update_company' })
  @AuthRoles({ roles: [UserRole.employer] })
  update(@Args() args: UpdateOneCompanyArgs) {
    return this.companyService.update(args);
  }

  @Mutation(() => Company, { name: 'delete_company' })
  @AuthRoles({ roles: [UserRole.employer, UserRole.admin] })
  delete(@Args() args: DeleteOneCompanyArgs) {
    return this.companyService.delete(args);
  }

  @Query(() => AllCompanyResult, { name: 'all_company' })
  all(@Args(new TakeLimit()) args: AllCompanyArgs) {
    return this.companyService.findMany(args);
  }

  @Query(() => Company, { name: 'one_company' })
  findOne(@Args() args: FindFirstCompanyArgs) {
    return this.companyService.findFirst(args);
  }

  @Query(() => AllCompanyResult, { name: 'my_company' })
  myCompany(@Args(new TakeLimit()) args: AllCompanyArgs) {
    return this.companyService.myCompany(args);
  }
}
