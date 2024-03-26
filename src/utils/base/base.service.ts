import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseService {
  abstract create(...args);

  abstract findUnique(...args);

  abstract findFirst(...args);

  abstract findMany(...args);

  abstract count(...args);

  abstract update(...args);

  abstract delete(...args);
}
