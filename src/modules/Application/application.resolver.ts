import { Application, CreateOneApplicationArgs } from '@/prisma/graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApplicationService } from './application.service';

@Resolver(() => Application)
export class ApplicationResolver {
  constructor(private readonly applicationService: ApplicationService) {}

  @Mutation(() => Application, { name: 'create_application' })
  create(@Args() args: CreateOneApplicationArgs): Promise<Application> {
    return this.applicationService.create(args);
  }

  @Query(() => Application, { name: 'find_application' })
  findUnique(@Args('id') id: string) {
    return this.applicationService.findUnique({ where: { id } });
  }
}
