import { Country, File, UpdateOneUserArgs } from '@/prisma/graphql';
import { CurrentUser } from '@/types';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';
import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthRoles } from '../auth/passport/jwt/jwt.decorator';
import { IDataloaders } from '../common/dataloader/dataloader.type';
import { UserService } from './user.service';
import { AllUserArgs, AllUserResult, UserOnly } from './user.type';

@Resolver(() => UserOnly)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => AllUserResult, { name: 'all_user' })
  @AuthRoles({ isOptional: true })
  all(@Args(new TakeLimit()) args: AllUserArgs) {
    return this.userService.findMany(args);
  }

  @Query(() => UserOnly, { name: 'me' })
  @AuthRoles()
  me(@Context() context) {
    const currentUser = context.req.user as CurrentUser;
    return this.userService.me({ userId: currentUser.id });
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
  @Mutation(() => UserOnly, { name: 'update_user' })
  update(@Args() args: UpdateOneUserArgs) {
    return this.userService.update(args);
  }
}
