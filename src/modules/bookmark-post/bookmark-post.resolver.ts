import { BookmarkPost } from '@/prisma/graphql';
import { ContextType } from '@/types';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthRoles } from '../auth/passport/jwt/jwt.decorator';
import { BookmarkPostService } from './bookmark-post.service';
import { BookmarkPostArgs, BookmarkPostResult } from './bookmark-post.type';

@Resolver(() => BookmarkPost)
export class BookmarkPostResolver {
  constructor(private readonly bookmarkPost: BookmarkPostService) {}
  @Mutation(() => BookmarkPostResult, { name: 'bookmark_post' })
  @AuthRoles()
  bookmark(@Args() args: BookmarkPostArgs, @Context() ctx: ContextType) {
    return this.bookmarkPost.bookmark(args, ctx.req.user);
  }
}
