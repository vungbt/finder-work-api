import {
  CompanySize,
  CreateOneCompanySizeArgs,
  DeleteOneCompanySizeArgs,
  FindFirstCompanySizeArgs,
  UpdateOneCompanySizeArgs
} from '@/prisma/graphql';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompanySizeService } from './company-size.service';
import { AllCompanySizeArgs, AllCompanySizeResult } from './company-size.type';

@Resolver(() => CompanySize)
export class CompanySizeResolver {
  constructor(private readonly companySizeService: CompanySizeService) {}

  @Mutation(() => CompanySize, { name: 'create_company_size' })
  create(@Args() args: CreateOneCompanySizeArgs) {
    return this.companySizeService.create(args);
  }

  @Mutation(() => CompanySize, { name: 'update_company_size' })
  update(@Args() args: UpdateOneCompanySizeArgs) {
    return this.companySizeService.update(args);
  }

  @Mutation(() => CompanySize, { name: 'delete_company_size' })
  delete(@Args() args: DeleteOneCompanySizeArgs) {
    return this.companySizeService.delete(args);
  }

  @Query(() => AllCompanySizeResult, { name: 'all_company_size' })
  all(@Args(new TakeLimit()) args: AllCompanySizeArgs) {
    return this.companySizeService.findMany(args);
  }

  @Query(() => CompanySize, { name: 'one_company_size' })
  findOne(@Args() args: FindFirstCompanySizeArgs) {
    return this.companySizeService.findFirst(args);
  }
}
