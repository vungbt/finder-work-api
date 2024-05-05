import { Country, FindFirstCountryArgs, FindManyCountryArgs } from '@/prisma/graphql';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AddressService } from './address.service';
import { Address, AllAddressArgs } from './address.type';
import { Cache } from 'cache-manager';
import { CACHE_KEYS } from '@/configs/constant';

@Resolver(() => Address)
export class AddressResolver {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly addressService: AddressService
  ) {}

  @Query(() => Address, { name: 'all_address' })
  async all(@Args(new TakeLimit(5000)) args: AllAddressArgs) {
    const data = await this.addressService.findAll(args);
    return data;
  }

  @Query(() => [Country], { name: 'all_country' })
  async allCountry(@Args() args: FindManyCountryArgs) {
    const countriesCache = await this.cacheService.get<Country[]>(CACHE_KEYS.all_country);
    if (countriesCache && countriesCache.length > 0) return countriesCache;
    const res = await this.addressService.findManyCountry(args);
    await this.cacheService.set(CACHE_KEYS.all_country, res);
    return res;
  }

  @Query(() => Country, { name: 'one_country' })
  findOne(@Args() args: FindFirstCountryArgs) {
    return this.addressService.findFirstCountry(args);
  }
}
