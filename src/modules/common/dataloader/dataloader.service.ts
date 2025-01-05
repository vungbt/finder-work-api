import { AddressService } from '@/modules/address/address.service';
import { JobTitleService } from '@/modules/job-title/job-title.service';
import { PostCategoryService } from '@/modules/post-category/post-category.service';
import { SettingService } from '@/modules/setting/setting.service';
import { TagService } from '@/modules/tag/tag.service';
import { UserService } from '@/modules/user/user.service';
import { Injectable } from '@nestjs/common';
import {
  City,
  Comment,
  Company,
  Country,
  File,
  JobCategory,
  JobTitle,
  Post,
  PostCategory,
  Setting,
  Skill,
  Tag,
  User
} from '@prisma/client';
import * as DataLoader from 'dataloader';
import { FileService } from '../../file/file.service';
import { IDataloaders } from './dataloader.type';
import { JobCategoryService } from '@/modules/job-category/job-category.service';
import { PostService } from '@/modules/post/post.service';
import { CommentService } from '@/modules/comment/comment.service';
import { CompanyService } from '@/modules/company/company.service';
import { SkillService } from '@/modules/skill/skill.service';

@Injectable()
export class DataloaderService {
  constructor(
    private readonly fileService: FileService,
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly addressService: AddressService,
    private readonly tagService: TagService,
    private readonly postCategoryService: PostCategoryService,
    private readonly jobTitleService: JobTitleService,
    private readonly jobCategoryService: JobCategoryService,
    private readonly settingService: SettingService,
    private readonly commentService: CommentService,
    private readonly companyService: CompanyService,
    private readonly skillService: SkillService
  ) {}

  getLoaders(): IDataloaders {
    const fileUnique = this._createFileUniqueLoader();
    const userUnique = this._createUserUniqueLoader();
    const countryUnique = this._createCountryUniqueLoader();
    const cityUnique = this._createCityUniqueLoader();
    const tagUnique = this._createTagUniqueLoader();
    const postCategoryUnique = this._createPostCategoryUniqueLoader();
    const jobTitleUnique = this._createJobTitleUniqueLoader();
    const jobCategoryUnique = this._createJobCategoryUniqueLoader();
    const tagMany = this._createTagManyLoader();
    const skillMany = this._createSkillManyLoader();
    const postCategoryMany = this._createPostCategoryManyLoader();
    const settingUnique = this._createSettingUniqueLoader();
    const postUnique = this._createPostUniqueLoader();
    const commentUnique = this._createCommentUniqueLoader();
    const companyUnique = this._createCompanyUniqueLoader();
    const skillUnique = this._createSkillUniqueLoader();

    return {
      fileUnique,
      userUnique,
      countryUnique,
      cityUnique,
      tagUnique,
      postCategoryUnique,
      jobTitleUnique,
      tagMany,
      postCategoryMany,
      settingUnique,
      jobCategoryUnique,
      postUnique,
      commentUnique,
      companyUnique,
      skillUnique,
      skillMany
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

  private _createUserUniqueLoader() {
    return new DataLoader<string, User>((keys: readonly string[]) => {
      return Promise.all(
        keys.map((key) => {
          return this.userService.findUnique({ where: { id: key } });
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

  private _createCityUniqueLoader() {
    return new DataLoader<number, City>((keys: readonly number[]) => {
      return Promise.all(
        keys.map((key) => {
          return this.addressService.findFirstCity({ where: { id: key } });
        })
      );
    });
  }

  private _createTagUniqueLoader() {
    return new DataLoader<string, Tag>((keys: readonly string[]) => {
      return Promise.all(
        keys.map((key) => {
          return this.tagService.findUnique({ where: { id: key } });
        })
      );
    });
  }

  private _createTagManyLoader() {
    return new DataLoader<string[], Tag[]>((keys: readonly string[][]) => {
      return Promise.all(
        keys.map((key) => {
          return this.tagService.findMany({ where: { id: { in: key } } });
        })
      );
    });
  }

  private _createSkillManyLoader() {
    return new DataLoader<string[], Skill[]>((keys: readonly string[][]) => {
      return Promise.all(
        keys.map((key) => {
          return this.skillService.findMany({ where: { id: { in: key } } });
        })
      );
    });
  }

  private _createPostCategoryUniqueLoader() {
    return new DataLoader<string, PostCategory>((keys: readonly string[]) => {
      return Promise.all(
        keys.map((key) => {
          return this.postCategoryService.findUnique({ where: { id: key } });
        })
      );
    });
  }

  private _createPostCategoryManyLoader() {
    return new DataLoader<string[], PostCategory[]>((keys: readonly string[][]) => {
      return Promise.all(
        keys.map((key) => {
          return this.postCategoryService.findMany({ where: { id: { in: key } } });
        })
      );
    });
  }

  private _createJobTitleUniqueLoader() {
    return new DataLoader<string, JobTitle>((keys: readonly string[]) => {
      return Promise.all(
        keys.map((key) => {
          return this.jobTitleService.findUnique({ where: { id: key } });
        })
      );
    });
  }

  private _createJobCategoryUniqueLoader() {
    return new DataLoader<string, JobCategory>((keys: readonly string[]) => {
      return Promise.all(
        keys.map((key) => {
          return this.jobCategoryService.findUnique({ where: { id: key } });
        })
      );
    });
  }

  private _createSettingUniqueLoader() {
    return new DataLoader<{ key: string; type: string }, Setting>(
      (keys: readonly { key: string; type: string }[]) => {
        return Promise.all(
          keys.map((item) => {
            return this.settingService.findUnique({
              where: { key_type: { key: item.key, type: item.type } }
            });
          })
        );
      }
    );
  }

  private _createPostUniqueLoader() {
    return new DataLoader<string, Post>((keys: readonly string[]) => {
      return Promise.all(
        keys.map((key) => {
          return this.postService.findUnique({ where: { id: key } });
        })
      );
    });
  }

  private _createCommentUniqueLoader() {
    return new DataLoader<string, Comment>((keys: readonly string[]) => {
      return Promise.all(
        keys.map((key) => {
          return this.commentService.findUnique({ where: { id: key } });
        })
      );
    });
  }

  private _createCompanyUniqueLoader() {
    return new DataLoader<string, Company>((keys: readonly string[]) => {
      return Promise.all(
        keys.map((key) => {
          return this.companyService.findUnique({ where: { id: key } });
        })
      );
    });
  }

  private _createSkillUniqueLoader() {
    return new DataLoader<string, Skill>((keys: readonly string[]) => {
      return Promise.all(
        keys.map((key) => {
          return this.skillService.findUnique({ where: { id: key } });
        })
      );
    });
  }
}
