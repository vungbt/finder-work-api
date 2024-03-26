import { Country, File, FindManyUserArgs } from '@/prisma/graphql';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';
import { Args, Context, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserOnly } from './user.type';
import { IDataloaders } from '../common/dataloader/dataloader.type';

@Resolver(() => UserOnly)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserOnly], { name: 'all_user' })
  all(@Args(new TakeLimit()) args: FindManyUserArgs) {
    return this.userService.findMany(args);
  }

  @ResolveField(() => File)
  avatar(@Parent() user: UserOnly, @Context() { loaders }: { loaders: IDataloaders }) {
    if (!user.avatarId) return null;
    return loaders.fileUnique.load(user.avatarId);
  }

  @ResolveField(() => Country)
  country(@Parent() user: UserOnly, @Context() { loaders }: { loaders: IDataloaders }) {
    if (!user.countryId) return null;
    return loaders.countryUnique.load(user.countryId);
  }
}
