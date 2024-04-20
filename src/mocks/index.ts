import { v4 as uuidv4 } from 'uuid';

const uuid = uuidv4();

export const dbMock = (entity: string, array: any, one: any) => {
  const newDb = {};
  const temp = {
    findMany: jest.fn().mockResolvedValue(array),
    findUnique: jest.fn().mockResolvedValue(one),
    findFirst: jest.fn().mockResolvedValue(one),
    create: jest.fn().mockReturnValue(one),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(one),
    delete: jest.fn().mockResolvedValue(one),
    count: jest.fn().mockResolvedValue(array?.length ?? 0)
  };
  newDb[`${entity}`] = temp;
  return {
    db: newDb,
    service: temp
  };
};

export const mockBasicInfo = {
  id: uuid,
  createdAt: new Date(),
  deletedAt: new Date(),
  updatedAt: new Date()
};
