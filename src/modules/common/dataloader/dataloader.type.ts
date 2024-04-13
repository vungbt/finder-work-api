import { Country, File, JobTitle, PostCategory, Tag, User } from '@prisma/client';
import DataLoader from 'dataloader';

export interface IDataloaders {
  fileUnique: DataLoader<string, File>;
  userUnique: DataLoader<string, User>;
  countryUnique: DataLoader<number, Country>;
  tagUnique: DataLoader<string, Tag>;
  tagMany: DataLoader<string[], Tag[]>;
  postCategoryMany: DataLoader<string[], PostCategory[]>;
  postCategoryUnique: DataLoader<string, PostCategory>;
  jobTitleUnique: DataLoader<string, JobTitle>;
}
