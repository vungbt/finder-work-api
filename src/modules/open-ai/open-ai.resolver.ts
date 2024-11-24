import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { OpenAiService } from './open-ai.service';
import { GenerateJDParams, GenerateResumeParams, OpenAIGenResult } from './open-ai.type';

@Resolver(() => String)
export class OpenAiResolver {
  constructor(private readonly openAiService: OpenAiService) {}

  @Mutation(() => OpenAIGenResult, { name: 'openai_job_description' })
  async generateJobDescription(
    @Args('args') args: GenerateJDParams,
    @Args('potentialCV', { nullable: true }) potentialCV?: string
  ) {
    return this.openAiService.generateJobDescription(args, potentialCV);
  }

  @Mutation(() => OpenAIGenResult, { name: 'openai_resume_description' })
  async generateResumeDescription(@Args('args') args: GenerateResumeParams) {
    return this.openAiService.generateResumeDescription(args);
  }

  @Mutation(() => OpenAIGenResult, { name: 'openai_resume_keyword' })
  async generateResumeKeywords(@Args('args') args: GenerateResumeParams) {
    return this.openAiService.generateResumeKeywords(args);
  }
}
