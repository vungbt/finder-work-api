import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';

@ObjectType()
export class OpenAIPromptResult {
  @Field(() => String)
  data: string;
}

@InputType()
export class GenerateJDParams {
  @Field({ nullable: true })
  platform?: string;

  @Field()
  type: string;

  @Field()
  level: string;

  @Field()
  language: string;

  @Field()
  category: string;

  @Field({ nullable: true })
  role?: string;

  @Field({ nullable: true })
  responsibility?: string;

  @Field({ nullable: true })
  qualification?: string;

  @Field({ nullable: true })
  benefit?: string;

  @Field()
  tone: string;

  @Field({ nullable: true })
  title?: string;
}

export enum ResumeType {
  SUMMARY = 'SUMMARY',
  OBJECTIVE = 'OBJECTIVE',
  WORK_EXPERIENCE = 'WORK_EXPERIENCE'
}

registerEnumType(ResumeType, {
  name: 'ResumeType'
});

@InputType()
export class GenerateResumeParams {
  @Field(() => ResumeType)
  type: ResumeType;

  @Field()
  jobTitle: string;

  @Field()
  language: string;

  @Field({ nullable: true })
  companyName?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field({ nullable: true })
  isCurrentlyWork?: boolean;

  @Field({ nullable: true })
  yearsOfExperience?: number;

  @Field({ nullable: true })
  keywords?: string;

  @Field({ nullable: true })
  careerGoals?: string;
}

@ObjectType()
export class OpenAIGenResult {
  @Field(() => String, { defaultValue: '' })
  data: string;
}
