import {
  CompanyType,
  CreateOneCompanyTypeArgs,
  DeleteOneCompanyTypeArgs,
  FindFirstCompanyTypeArgs,
  UpdateOneCompanyTypeArgs
} from '@/prisma/graphql';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompanyTypeService } from './company-type.service';
import { AllCompanyTypeArgs, AllCompanyTypeResult } from './company-type.type';

@Resolver(() => CompanyType)
export class CompanyTypeResolver {
  constructor(private readonly companyTypeService: CompanyTypeService) {}

  @Mutation(() => CompanyType, { name: 'create_company_type' })
  create(@Args() args: CreateOneCompanyTypeArgs) {
    return this.companyTypeService.create(args);
  }

  @Mutation(() => CompanyType, { name: 'update_company_type' })
  update(@Args() args: UpdateOneCompanyTypeArgs) {
    return this.companyTypeService.update(args);
  }

  @Mutation(() => CompanyType, { name: 'delete_company_type' })
  delete(@Args() args: DeleteOneCompanyTypeArgs) {
    return this.companyTypeService.delete(args);
  }

  @Query(() => AllCompanyTypeResult, { name: 'all_company_type' })
  all(@Args(new TakeLimit()) args: AllCompanyTypeArgs) {
    return this.companyTypeService.findMany(args);
  }

  @Query(() => CompanyType, { name: 'one_company_type' })
  findOne(@Args() args: FindFirstCompanyTypeArgs) {
    return this.companyTypeService.findFirst(args);
  }
}
