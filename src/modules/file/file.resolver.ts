import { File } from '@/prisma/graphql';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { FileService } from './file.service';
import { FileArgs } from './file.type';

@Resolver(() => File)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Query(() => String, { name: 'upload_url' })
  getUploadUrl(@Args() args: FileArgs) {
    return this.fileService.uploadUrl(args.name);
  }
}
