import { CityWhereInput } from '@/prisma/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { responseHelper } from '@/utils/helpers';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AllAddressArgs } from './address.type';

@Injectable()
export class AddressService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(args: AllAddressArgs) {
    const { searchValue, pagination, where, ...reset } = args;
    let whereClause: CityWhereInput = {};

    if (searchValue && searchValue.length > 0) {
      whereClause.OR = [
        { name: { contains: searchValue, mode: 'insensitive' } },
        { stateName: { contains: searchValue, mode: 'insensitive' } },
        { countryName: { contains: searchValue, mode: 'insensitive' } }
      ];
    }

    if (where) {
      whereClause = {
        AND: [whereClause, where]
      };
    }
    const total = await this.count({ where: whereClause });
    const data = await this.prismaService.city.findMany({ where: whereClause, ...reset });
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
  findFirstCity(args: Prisma.CityFindFirstArgs) {
    return this.prismaService.city.findFirst(args);
  }
}
