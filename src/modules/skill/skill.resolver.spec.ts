import { skillMock } from '@/mocks/skill';
import { Test, TestingModule } from '@nestjs/testing';
import { SkillResolver } from './skill.resolver';
import { SkillService } from './skill.service';

describe('SkillResolver', () => {
  let resolver: SkillResolver;
  const { oneSkill, skills } = skillMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillResolver,
        {
          provide: SkillService,
          useValue: skillMock.service
        }
      ]
    }).compile();

    resolver = module.get<SkillResolver>(SkillResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('create_skill', () => {
    it('should successfully insert a cat', async () => {
      const res = await resolver.create({ data: { content: oneSkill.content } });
      expect(res).toEqual(oneSkill);
    });
  });

  describe('update_skill', () => {
    it('should get a new skill', async () => {
      const skill = await resolver.update({
        where: { id: oneSkill.id },
        data: { content: { set: oneSkill.content } }
      });
      expect(skill).toEqual(oneSkill);
    });
  });

  describe('delete_skill', () => {
    it('should delete a skill', async () => {
      const skill = await resolver.delete({ where: { id: oneSkill.id } });
      expect(skill).toEqual(oneSkill);
    });
  });

  describe('all_skill', () => {
    it('should get a many skill', async () => {
      const res = await resolver.all({ where: { id: { equals: oneSkill.id } } });
      expect(res).toEqual(skills);
    });
  });

  describe('one_skill', () => {
    it('should get a many skill', async () => {
      const skills = await resolver.findOne({ where: { id: { equals: oneSkill.id } } });
      expect(skills).toEqual(skills);
    });
  });
});
