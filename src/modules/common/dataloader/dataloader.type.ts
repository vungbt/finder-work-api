import {
  City,
  Comment,
  Company,
  Country,
  File,
  JobCategory,
  JobTitle,
  Post,
  PostCategory,
  Setting,
  Skill,
  Tag,
  User
} from '@prisma/client';
import DataLoader from 'dataloader';

export interface IDataloaders {
  fileUnique: DataLoader<string, File>;
  userUnique: DataLoader<string, User>;
  companyUnique: DataLoader<string, Company>;
  skillUnique: DataLoader<string, Skill>;
  skillMany: DataLoader<string[], Skill[]>;
  countryUnique: DataLoader<number, Country>;
  cityUnique: DataLoader<number, City>;
  tagUnique: DataLoader<string, Tag>;
  tagMany: DataLoader<string[], Tag[]>;
  postCategoryMany: DataLoader<string[], PostCategory[]>;
  postCategoryUnique: DataLoader<string, PostCategory>;
  jobTitleUnique: DataLoader<string, JobTitle>;
  jobCategoryUnique: DataLoader<string, JobCategory>;
  settingUnique: DataLoader<{ key: string; type: string }, Setting>;
  postUnique: DataLoader<string, Post>;
  commentUnique: DataLoader<string, Comment>;
}
