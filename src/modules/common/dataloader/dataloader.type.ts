import { Country, File } from '@prisma/client';
import DataLoader from 'dataloader';

export interface IDataloaders {
  fileUnique: DataLoader<string, File>;
  countryUnique: DataLoader<number, Country>;
}
