/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient, TagType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as slug from 'slug';

import * as countries from './address/countries.json';
import * as states from './address/states.json';
import * as cities from './address/cities/cities.json';
import * as cities1 from './address/cities/cities1.json';
import * as cities2 from './address/cities/cities2.json';
import * as cities3 from './address/cities/cities3.json';
import * as cities4 from './address/cities/cities4.json';
import * as cities5 from './address/cities/cities5.json';
import * as cities6 from './address/cities/cities6.json';
import * as cities7 from './address/cities/cities7.json';

// post
import * as postCategories from './post/categories.json';
import * as tagCategories from './post/tags.json';

// job
import * as jobCategories from './job/categories.json';

// company
import * as companySizes from './company/size.json';
import * as companyTypes from './company/type.json';

const prisma = new PrismaClient();

// const arr = (length: number) => [...Array.from(new Array(length))];

// const random = (arr: any) => arr[Math.floor(Math.random() * arr.length)];

const importingCities = async (cities) => {
  for (const iterator of cities) {
    const { state_id, state_code, state_name, country_id, country_code, country_name, ...state } =
      iterator;

    const data = {
      ...state,
      stateId: state_id,
      stateCode: String(state_code),
      stateName: state_name,
      countryId: country_id,
      countryCode: String(country_code),
      countryName: String(country_name),
      latitude: String(state.latitude),
      longitude: String(state.longitude)
    };
    await prisma.city.create({
      data
    });
  }
};
async function main() {
  console.log('---> importing countries <---');
  for (const iterator of countries) {
    const {
      numeric_code,
      phone_code,
      currency_name,
      currency_symbol,
      region_id,
      subregion_id,
      ...country
    } = iterator;

    const data = {
      ...country,
      numericCode: numeric_code,
      phoneCode: phone_code,
      currencyName: currency_name,
      currencySymbol: currency_symbol,
      regionId: region_id,
      subregionId: subregion_id
    };
    await prisma.country.create({
      data
    });
  }

  console.log('---> importing states <---');
  for (const iterator of states) {
    const { country_id, country_code, country_name, state_code, id, ...state } = iterator;
    const data = {
      id: Number(id),
      name: String(state.name),
      type: String(state.type),
      countryId: Number(country_id),
      countryCode: String(country_code),
      countryName: String(country_name),
      stateCode: String(state_code),
      latitude: String(state.latitude),
      longitude: String(state.longitude)
    };
    await prisma.state.create({
      data
    });
  }

  console.log('---> importing cities <---');
  await Promise.all([
    importingCities(cities),
    importingCities(cities1),
    importingCities(cities2),
    importingCities(cities3),
    importingCities(cities4),
    importingCities(cities5),
    importingCities(cities6),
    importingCities(cities7)
  ]);

  console.log('---> importing post categories <---');
  for (const iterator of postCategories) {
    await prisma.postCategory.create({
      data: {
        name: iterator,
        slug: slug(iterator)
      }
    });
  }

  console.log('---> importing tag <---');
  for (const iterator of tagCategories) {
    await prisma.tag.create({
      data: {
        name: iterator,
        type: TagType.post,
        color: faker.color.rgb(),
        isPostDefault: true
      }
    });
  }

  console.log('---> importing job categories <---');
  for (const iterator of jobCategories) {
    await prisma.jobCategory.create({
      data: {
        name: iterator.value,
        slug: slug(iterator.value),
        isFeature: iterator.isFeature,
        isTheFive: iterator.isTheFive
      }
    });
  }

  console.log('---> importing company size <---');
  for (const iterator of companySizes) {
    await prisma.companySize.create({
      data: {
        key: iterator,
        value: slug(iterator),
        isDefault: true
      }
    });
  }

  console.log('---> importing company type <---');
  for (const iterator of companyTypes) {
    await prisma.companyType.create({
      data: {
        key: iterator,
        value: slug(iterator),
        isDefault: true
      }
    });
  }

  return {
    file: 0,
    category: 0,
    product: 0,
    productVariant: 0
  };
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
