import { Query, Resolver } from '@nestjs/graphql';
import { TestService } from './test.service';

@Resolver(() => Number)
export class TestResolver {
  constructor(private readonly testService: TestService) {}

  @Query(() => Number, { name: 'dev_company_dumb' })
  devCompanyDumb() {
    return this.testService.devCompanyDumb();
  }

  @Query(() => Number, { name: 'stg_company_dumb' })
  stgCompanyDumb() {
    return this.testService.stgCompanyDumb();
  }

  @Query(() => Number, { name: 'dev_job_dumb' })
  devJobDumb() {
    return this.testService.devJobsDumb();
  }

  @Query(() => Number, { name: 'dev_post_dumb' })
  devPostDumb() {
    return this.testService.devPostDumb();
  }
}
