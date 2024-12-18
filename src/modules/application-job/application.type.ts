import { ArgsType, Field } from '@nestjs/graphql';
import { ApplicationCreateInput } from '@/prisma/graphql';

@ArgsType()
export class CreateApplicationArgs {
  @Field(() => ApplicationCreateInput)
  data: ApplicationCreateInput;
}
