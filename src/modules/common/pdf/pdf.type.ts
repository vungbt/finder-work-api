import { registerEnumType } from '@nestjs/graphql';

export enum EResumeTemplate {
  resumeOne = 'resume-1/one'
}
registerEnumType(EResumeTemplate, {
  name: 'ResumeTemplate'
});
