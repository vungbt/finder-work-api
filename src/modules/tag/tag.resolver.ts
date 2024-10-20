import {
  CreateOneTagArgs,
  DeleteOneTagArgs,
  FindFirstTagArgs,
  Tag,
  UpdateOneTagArgs
} from '@/prisma/graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TagService } from './tag.service';
import { AllTagArgs, AllTagResult } from './tag.type';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Mutation(() => Tag, { name: 'create_tag' })
  create(@Args() args: CreateOneTagArgs) {
    return this.tagService.create(args);
  }

  @Mutation(() => Tag, { name: 'update_tag' })
  update(@Args() args: UpdateOneTagArgs) {
    return this.tagService.update(args);
  }

  @Mutation(() => Tag, { name: 'delete_tag' })
  delete(@Args() args: DeleteOneTagArgs) {
    return this.tagService.delete(args);
  }

  @Query(() => AllTagResult, { name: 'all_tag' })
  all(@Args(new TakeLimit()) args: AllTagArgs) {
    return this.tagService.findAll(args);
  }

  @Query(() => Tag, { name: 'one_tag' })
  findOne(@Args() args: FindFirstTagArgs) {
    return this.tagService.findFirst(args);
  }
}
