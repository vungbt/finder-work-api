import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { FileService } from '../../file/file.service';
import { Country, File } from '@prisma/client';
import { IDataloaders } from './dataloader.type';
import { AddressService } from '@/modules/address/address.service';

@Injectable()
export class DataloaderService {
  constructor(
    private readonly fileService: FileService,
    private readonly addressService: AddressService
  ) {}

  getLoaders(): IDataloaders {
    const fileUnique = this._createFileUniqueLoader();
    const countryUnique = this._createCountryUniqueLoader();
    return {
      fileUnique,
      countryUnique
    };
  }

  private _createFileUniqueLoader() {
    return new DataLoader<string, File>((keys: readonly string[]) => {
      return Promise.all(
        keys.map((key) => {
          return this.fileService.findUnique({ where: { id: key } });
        })
      );
    });
  }

  private _createCountryUniqueLoader() {
    return new DataLoader<number, Country>((keys: readonly number[]) => {
      return Promise.all(
        keys.map((key) => {
          return this.addressService.findFirstCountry({ where: { id: key } });
        })
      );
    });
  }
}
