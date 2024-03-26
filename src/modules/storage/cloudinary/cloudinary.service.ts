import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { StorageService } from '../storage.service';
import { FileType } from '@/types';
import * as slug from 'slug';
import { formatDate, strGenerate } from '@/utils/helpers';
import { stringify } from 'querystring';

@Injectable()
export class CloudinaryService extends StorageService {
  private config: cloudinary.ConfigOptions;

  constructor() {
    super();
    this.config = cloudinary.v2.config();
  }

  getName(name?: string) {
    const fileName = `${formatDate(new Date())}-${slug(
      name || strGenerate({ length: 10, lowerCase: true })
    )}`;
    return fileName;
  }

  async uploadUrl(name?: string) {
    const result = cloudinary.v2.utils.sign_request({
      public_id: `temp/${this.getName(name)}`,
      timestamp: Math.round(new Date().getTime() / 1000)
    });
    return this.getUrlUpload(result);
  }

  getUrlUpload(params: { [key: string]: any; signature: string; api_key: string }) {
    const { cloud_name, cloudinary_domain } = cloudinary.v2.config();
    return `${cloudinary_domain}/${cloud_name}/auto/upload?${stringify(params)}`;
  }

  download(url: string): Promise<FileType> {
    return cloudinary.v2.uploader.upload(url, {
      public_id: `temp/${this.getName()}`,
      timestamp: Math.round(new Date().getTime() / 1000)
    }) as Promise<FileType>;
  }

  getInfo(id: string) {
    return cloudinary.v2.api.resource(id);
  }

  move(id: string, folder: string) {
    const lastName = id.split('/').pop();
    const newId = `${folder}/${lastName}`;
    return cloudinary.v2.uploader.rename(id, newId);
  }

  async delete(id: string) {
    try {
      return await cloudinary.v2.uploader.destroy(id).then((res) => res?.result === 'ok');
    } catch (error) {}
    return false;
  }
}
