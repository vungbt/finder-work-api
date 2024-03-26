import { MAX_LIMIT } from '@/configs/constant';
import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TakeLimit implements PipeTransform {
  constructor(private limit: number = MAX_LIMIT) {}
  transform(argsReq: any) {
    const pagination = argsReq?.pagination;
    const defaultLimit = this.limit;

    if (pagination) {
      const { page, limit: pageLimit } = pagination;

      // Set take based on pageLimit or defaultLimit
      const take =
        !pageLimit || pageLimit > defaultLimit || defaultLimit < 0 ? defaultLimit : pageLimit;

      // Set skip based on the page
      argsReq.skip = Math.max(0, (page - 1) * take);

      // Set take in argsReq
      argsReq.take = take;
    }

    // Ensure argsReq.take is within the allowed limit
    if (!argsReq.take || argsReq.take || !pagination) {
      argsReq.take = Math.min(argsReq.take || defaultLimit, defaultLimit);
    }
    return argsReq;
  }
}
