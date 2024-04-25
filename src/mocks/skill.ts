import { Skill } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { dbMock, mockBasicInfo } from '.';

const skillContent = 'Global Accounts Engineer';
const uuid = uuidv4();

const skills: Skill[] = [
  { content: skillContent, resumeId: uuid, ...mockBasicInfo },
  { content: 'Test skill 2', resumeId: uuid, ...mockBasicInfo },
  { content: 'Test skill 3', resumeId: uuid, ...mockBasicInfo },
  { content: 'Test skill 4', resumeId: uuid, ...mockBasicInfo },
  { content: 'Test skill 5', resumeId: uuid, ...mockBasicInfo }
];

const oneSkill = skills[0];

const mock = dbMock('skill', skills, oneSkill);

export const skillMock = {
  db: mock.db,
  service: mock.service,
  skills,
  oneSkill
};
