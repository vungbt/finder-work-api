import { skillMock } from '@/mocks/skill';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { SkillService } from './skill.service';

describe('SkillService', () => {
  let service: SkillService;
  const { db, oneSkill, skills } = skillMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          expandVariables: true
        })
      ],
      providers: [SkillService, { provide: PrismaService, useValue: db }]
    }).compile();

    service = module.get<SkillService>(SkillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully insert a cat', async () => {
      const skill = await service.create({
        data: { content: oneSkill.content }
      });
      expect(skill).toEqual(oneSkill);
    });
  });

  describe('findUnique', () => {
    it('should get a unique skill', async () => {
      const skill = await service.findUnique({ where: { id: oneSkill.id } });
      expect(skill).toEqual(oneSkill);
    });
  });

  describe('findFirst', () => {
    it('should get a first skill', async () => {
      const skill = await service.findFirst({ where: { id: oneSkill.id } });
      expect(skill).toEqual(oneSkill);
    });
  });

  describe('findMany', () => {
    it('should get a many skill', async () => {
      const res = await service.findMany({ where: { id: oneSkill.id } });
      expect(res).toEqual(skills);
    });
  });

  describe('count', () => {
    it('should get a total skill', async () => {
      const total = await service.count({ where: { id: oneSkill.id } });
      expect(total).toEqual(skills.length);
    });
  });

  describe('update', () => {
    it('should delete a new skill', async () => {
      const skill = await service.update({ where: { id: oneSkill.id }, data: oneSkill });
      expect(skill).toEqual(oneSkill);
    });
  });

  describe('delete', () => {
    it('should get a skill', async () => {
      const skill = await service.delete({ where: { id: oneSkill.id } });
      expect(skill).toEqual(oneSkill);
    });
  });
});
