import {
  Activity,
  Certificate,
  Degree,
  Education,
  EducationType,
  FindManyResumeArgs,
  Project,
  Resume,
  Social,
  SocialType,
  WorkExperience,
  WorkPosition
} from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { EResumeTemplate } from '../common/pdf/pdf.type';

@ArgsType()
export class AllResumeArgs extends FindManyResumeArgs {
  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;

  @Field(() => String, { nullable: true })
  searchValue?: string;
}

@ObjectType()
export class AllResumeResult {
  @Field(() => [Resume])
  data: Resume[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}

@InputType()
export class ResumePersonalInfo {
  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  avatarPublicId: string;

  @Field(() => String, { nullable: true })
  avatarId?: string;

  @Field(() => String, { nullable: false })
  fullName: string;

  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: false })
  phoneNumber: string;

  @Field(() => Number, { nullable: false })
  cityId: number;

  @Field(() => String, { nullable: false })
  addressDetail: string;

  @Field(() => String, { nullable: false })
  description: string;

  @Field(() => String, { nullable: false })
  jobTitleId: string;

  @Field(() => Boolean, { nullable: false, defaultValue: false })
  isSummary: boolean;
}

@InputType()
export class ResumeWorkExperience extends OmitType(WorkExperience, [
  'companyId',
  'jobTitleId',
  'jobTitle',
  'cityId',
  'address',
  'company',
  'endAt'
]) {
  @Field(() => String, { nullable: false })
  jobTitleId: string;

  @Field()
  companyName: string;

  @Field({ nullable: true })
  companyId?: string;

  @Field(() => Boolean, { nullable: false, defaultValue: false })
  isFreelancer: boolean;

  @Field(() => Date, { nullable: false })
  startAt: Date;

  @Field(() => Date, { nullable: true, defaultValue: null })
  endAt?: Date;

  @Field(() => String, { nullable: false })
  description: string;

  @Field(() => Boolean, { nullable: false, defaultValue: false })
  isCurrentlyWorkHere: boolean;

  @Field(() => Number, { nullable: false })
  cityId: number;
}

@InputType()
export class ResumeProject extends OmitType(Project, [
  'refeUrls',
  'companyId',
  'company',
  'thumbnailId'
]) {
  @Field(() => String, { nullable: false })
  title: string;

  @Field(() => String, { nullable: false })
  description: string;

  @Field(() => Number, { nullable: false, defaultValue: 1 })
  teamSize: number;

  @Field(() => WorkPosition, { nullable: false, defaultValue: WorkPosition.staff })
  role: WorkPosition;

  @Field(() => [String], { nullable: false, defaultValue: [] })
  techStackIds: string[];

  @Field(() => Date, { nullable: false })
  startAt: Date;

  @Field(() => Date, { nullable: false })
  endAt: Date;

  @Field()
  companyName: string;

  @Field({ nullable: true })
  companyId?: string;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  refeUrls?: string[];

  @Field(() => Boolean, { nullable: false, defaultValue: false })
  isFreelancer: boolean;

  @Field(() => String, { nullable: true })
  thumbnailPublicId?: string;

  @Field(() => String, { nullable: true })
  thumbnailId?: string;
}

@InputType()
export class ResumeEducation extends OmitType(Education, [
  'awards',
  'relevantCourseWorks',
  'major',
  'skillId'
]) {
  @Field(() => EducationType, { nullable: false, defaultValue: EducationType.university })
  type: EducationType;

  @Field(() => String, { nullable: false })
  majorId: string;

  @Field(() => Degree, { nullable: false, defaultValue: Degree.high_school_diploma })
  degree: Degree;

  @Field(() => Date, { nullable: false, defaultValue: new Date() })
  graduationAt: Date;

  @Field(() => Number, { nullable: false, defaultValue: 1 })
  gpa: number;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  awards?: string[];

  @Field(() => [String], { nullable: true, defaultValue: [] })
  relevantCourseWorks?: string[];
}

@InputType()
export class ResumeCertificate extends OmitType(Certificate, ['file', 'fileId']) {
  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  filePublicId: string;

  @Field(() => String, { nullable: true })
  fileId?: string;
}

@InputType()
export class ResumeSocial extends Social {
  @Field(() => SocialType, { nullable: false })
  type: SocialType;

  @Field(() => String, { nullable: false })
  url: string;
}

@InputType()
export class ResumeActivity extends Activity {
  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => Date, { nullable: false })
  startAt: Date;

  @Field(() => Date, { nullable: false })
  endAt: Date;

  @Field(() => String, { nullable: false })
  description: string;
}

@ArgsType()
export class CreateResumeArgs {
  @Field(() => EResumeTemplate, { nullable: false })
  resumeTemplateName: EResumeTemplate;

  @Field(() => ResumePersonalInfo, { nullable: false })
  @Type(() => ResumePersonalInfo)
  personalInfo!: InstanceType<typeof ResumePersonalInfo>;

  @Field(() => [ResumeWorkExperience], { nullable: false, defaultValue: [] })
  @Type(() => ResumeWorkExperience)
  workExperiences!: InstanceType<typeof ResumeWorkExperience>[];

  @Field(() => [ResumeProject], { nullable: true, defaultValue: [] })
  @Type(() => ResumeProject)
  projects?: InstanceType<typeof ResumeProject>[];

  @Field(() => [ResumeEducation], { nullable: true, defaultValue: [] })
  @Type(() => ResumeEducation)
  educations?: InstanceType<typeof ResumeEducation>[];

  @Field(() => [String], { nullable: true, defaultValue: [] })
  languageSkillIds?: string[];

  @Field(() => [String], { nullable: true, defaultValue: [] })
  skillIds?: string[];

  @Field(() => [String], { nullable: true, defaultValue: [] })
  skillContents?: string[];

  @Field(() => [ResumeCertificate], { nullable: true, defaultValue: [] })
  @Type(() => ResumeCertificate)
  certificates?: InstanceType<typeof ResumeCertificate>[];

  @Field(() => [ResumeSocial], { nullable: true, defaultValue: [] })
  @Type(() => ResumeSocial)
  socials?: InstanceType<typeof ResumeSocial>[];

  @Field(() => [ResumeActivity], { nullable: true, defaultValue: [] })
  @Type(() => ResumeActivity)
  activities?: InstanceType<typeof ResumeActivity>[];

  @Field(() => String, { nullable: true })
  userId?: string;
}

@ObjectType()
export class ResumePreviewResult {
  @Field(() => String)
  pdfBase64: string;

  @Field(() => String)
  imgBase64: string;
}

@ArgsType()
export class MyResumeArgs extends AllResumeArgs {
  @Field(() => String, { nullable: true })
  userId?: string;
}
