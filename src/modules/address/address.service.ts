import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { AllAddressArgs } from './address.type';
import { Prisma } from '@prisma/client';
import { responseHelper } from '@/utils/helpers';
import { FindManyCityArgs } from '@/prisma/graphql';

@Injectable()
export class AddressService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(args: AllAddressArgs) {
    const { searchValue, pagination, ...reset } = args;
    const queries: FindManyCityArgs = {};

    if (searchValue && searchValue.length > 0) {
      queries.where = {
        OR: [
          { name: { contains: searchValue } },
          { stateName: { contains: searchValue } },
          { countryName: { contains: searchValue } }
        ]
      };
    }

    const total = await this.count(queries);
    const data = await this.prismaService.city.findMany({ ...queries, ...reset });
    return responseHelper(data, { total, ...pagination });
  }

  count(args: Prisma.CityCountArgs) {
    return this.prismaService.city.count(args);
  }

  findFirstCountry(args: Prisma.CountryFindFirstArgs) {
    return this.prismaService.country.findFirst(args);
  }
  findManyCountry(args: Prisma.CountryFindManyArgs) {
    return this.prismaService.country.findMany(args);
  }
}
