import { Skill } from '@prisma/client';
import { dbMock, mockBasicInfo } from '.';

const skillContent = 'Global Accounts Engineer';

const skills: Skill[] = [
  { content: skillContent, ...mockBasicInfo },
  { content: 'Test skill 2', ...mockBasicInfo },
  { content: 'Test skill 3', ...mockBasicInfo },
  { content: 'Test skill 4', ...mockBasicInfo },
  { content: 'Test skill 5', ...mockBasicInfo }
];

const oneSkill = skills[0];

const mock = dbMock('skill', skills, oneSkill);

export const skillMock = {
  db: mock.db,
  service: mock.service,
  skills,
  oneSkill
};
