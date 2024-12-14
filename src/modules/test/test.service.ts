import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import * as slug from 'slug';
import { CloudinaryService } from '../storage/cloudinary/cloudinary.service';
import * as company1 from './dumb/company/company-1.json';
import * as company2 from './dumb/company/company-2.json';
import { FileService } from '../file/file.service';
import { STORE_FOLDER } from '@/configs/constant';
import { JobLevel, JobSalary, JobStatus, JobType, SocialType } from '@prisma/client';

// jobs
import * as posts from './dumb/career/career-1.json';

// stg
import * as companiesStag from './dumb/stg/company.json';
import * as socialsStag from './dumb/stg/social.json';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { addDays } from 'date-fns';

@Injectable()
export class TestService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly fileService: FileService,
    private readonly httpService: HttpService
  ) {}

  async devCompanyDumb() {
    let user = await this.prismaService.user.findFirst({ where: { role: 'super_admin' } });
    if (!user || !user?.id) {
      user = await this.prismaService.user.create({
        data: {
          avatarUrl:
            'https://lh3.googleusercontent.com/a/ACg8ocLRgOOu5zILwbtpyNJ7rhh0y_wBHtxeo8zQ4WkpF3Xu-BkaXzKJ=s96-c',
          lastName: 'Admin',
          firstName: 'Super',
          email: 'super-finder@yopmail.com',
          emailVerified: true,
          password: '$2a$10$r6tEurNNJRVtCwR5p.6cxudB2.WCQAlkHnaL4.PkZ5OKZkGMRrhpS',
          phoneNumber: '000000000',
          countryId: 242,
          status: 'active',
          signInProvider: 'google',
          color: '#586EE0',
          role: 'super_admin'
        }
      });
    }

    const sizes = await this.prismaService.companySize.findMany({ select: { id: true } });
    const types = await this.prismaService.companyType.findMany({ select: { id: true } });
    const jobCategories = await this.prismaService.jobCategory.findMany({ select: { id: true } });
    const cities = await this.prismaService.city.findMany({ select: { id: true } });
    const listSize = sizes.map((item) => item.id);
    const listType = types.map((item) => item.id);
    const listJobCategory = jobCategories.map((item) => item.id);
    const listCity = cities.map((item) => item.id);

    const companies1 = company1.data.rows;
    const companies2 = company2.data.rows;
    const FILE_PATH = 'https://d2rp8rvurt6n5g.cloudfront.net';
    const dumpCompanies = companies1.concat(companies2);
    let totalCompany = 0;
    console.log(`Start dumb with ==> ${dumpCompanies.length} <== companies.`);
    const batchSize = 10; // Adjust batch size
    for (let i = 0; i < dumpCompanies.length; i += batchSize) {
      const batch = dumpCompanies.slice(i, i + batchSize);
      await this.prismaService.$transaction(
        async (prisma) => {
          for (const companyDumb of batch) {
            console.log('listSize===>', listSize);
            console.log('listType===>', listType);
            console.log('listJobCategory===>', listJobCategory);
            console.log('radom===>', this.random(listJobCategory));
            const companyType = this.random(listType);
            const companySize = this.random(listSize);
            const industry1 = this.random(listJobCategory);
            const industry2 = this.random(listJobCategory);
            const industry3 = this.random(listJobCategory);
            const cityId = this.random(listCity);
            const city = await this.prismaService.city.findFirst({ where: { id: cityId } });
            const industries = [{ id: industry1 }, { id: industry2 }, { id: industry3 }];

            const previewLogo = companyDumb.logo;
            let fileUploaded: any = null;
            if (previewLogo && previewLogo.length > 0) {
              const cloudinaryFile = await this.cloudinaryService.uploadFile(
                `${FILE_PATH}/${previewLogo}`
              );
              console.log('cloudinaryFile===>', cloudinaryFile?.public_id);
              if (
                cloudinaryFile &&
                cloudinaryFile.public_id &&
                cloudinaryFile.public_id.length > 0
              ) {
                fileUploaded = await this.fileService.createFromStorageId(
                  cloudinaryFile.public_id,
                  {
                    folder: `${STORE_FOLDER}/companies`
                  }
                );
              }
            }
            console.log('Created file successfully===>', fileUploaded?.id);

            // create social
            const socialItems = [
              { website: companyDumb.website },
              { twitter: companyDumb.twitter },
              { linkedIn: companyDumb.linkedIn },
              { instagram: companyDumb.instagram },
              { tiktok: companyDumb.tiktok },
              { facebook: companyDumb.facebook }
            ].filter((item) => Object.values(item)[0] && Object.values(item)[0].length > 0);

            console.log('Social items ===>', socialItems);
            const socials = [];
            if (socialItems.length > 0) {
              for (const socialItem of socialItems) {
                const newSocial = await prisma.social.create({
                  data: {
                    type: Object.keys(socialItem)[0] as SocialType,
                    url: Object.values(socialItem)[0]
                  }
                });
                socials.push({ id: newSocial.id });
              }
            }
            console.log('Socials ===>', socials);

            const newCompany = await prisma.company.create({
              data: {
                id: companyDumb.id,
                type: {
                  connect: {
                    id: companyType
                  }
                },
                size: {
                  connect: {
                    id: companySize
                  }
                },
                name: companyDumb.name,
                slug: slug(companyDumb.name),
                address: {
                  connect: {
                    id: cityId
                  }
                },
                social: { connect: socials },
                user: {
                  connect: {
                    id: user.id
                  }
                },
                addressDetail: city.name,
                description: companyDumb.introduction,
                avatar:
                  fileUploaded && fileUploaded?.id
                    ? {
                        connect: {
                          id: fileUploaded.id
                        }
                      }
                    : undefined,
                industries: {
                  connect: industries
                }
              }
            });
            totalCompany += 1;
            console.log(`Create Successfully with COMPANY NAME = ${newCompany.name}`);
          }
        },
        { timeout: 10000000 }
      );
    }
    console.log('Result ===>', totalCompany);
    return totalCompany;
  }

  async stgCompanyDumb() {
    const companiesDumb = companiesStag.Company ?? [];
    const socialsDumb = socialsStag.Social ?? [];
    let totalCompany = 0;

    let user = await this.prismaService.user.findFirst({ where: { role: 'super_admin' } });
    if (!user || !user?.id) {
      user = await this.prismaService.user.create({
        data: {
          avatarUrl:
            'https://lh3.googleusercontent.com/a/ACg8ocLRgOOu5zILwbtpyNJ7rhh0y_wBHtxeo8zQ4WkpF3Xu-BkaXzKJ=s96-c',
          lastName: 'Admin',
          firstName: 'Super',
          email: 'super-finder@yopmail.com',
          emailVerified: true,
          password: '$2a$10$r6tEurNNJRVtCwR5p.6cxudB2.WCQAlkHnaL4.PkZ5OKZkGMRrhpS',
          phoneNumber: '000000000',
          countryId: 242,
          status: 'active',
          signInProvider: 'google',
          color: '#586EE0',
          role: 'super_admin'
        }
      });
    }

    // get some company info
    const sizes = await this.prismaService.companySize.findMany({ select: { id: true } });
    const types = await this.prismaService.companyType.findMany({ select: { id: true } });
    const jobCategories = await this.prismaService.jobCategory.findMany({
      select: { id: true }
    });
    const cities = await this.prismaService.city.findMany({ select: { id: true } });

    console.log(`Start dumb with ==> ${companiesDumb.length} <== companies.`);
    const batchSize = 10; // Adjust batch size
    for (let i = 0; i < companiesDumb.length; i += batchSize) {
      const batch = companiesDumb.slice(i, i + batchSize);
      await this.prismaService.$transaction(
        async (prisma) => {
          for (const companyDumb of batch) {
            const listSize = sizes.map((item) => item.id);
            const listType = types.map((item) => item.id);
            const listJobCategory = jobCategories.map((item) => item.id);
            const listCity = cities.map((item) => item.id);

            const companyType = this.random(listType);
            const companySize = this.random(listSize);
            const industry1 = this.random(listJobCategory);
            const industry2 = this.random(listJobCategory);
            const industry3 = this.random(listJobCategory);
            const cityId = this.random(listCity);
            const city = await this.prismaService.city.findFirst({ where: { id: cityId } });
            const industries = [{ id: industry1 }, { id: industry2 }, { id: industry3 }];

            // files
            let fileUploaded = null;
            if (companyDumb?.avatarId) {
              fileUploaded = await this.fileService.findFirst({
                where: { id: companyDumb?.avatarId }
              });
            }
            console.log('Company ID: ', companyDumb?.id);
            console.log('Company Avatar Valid With ID: ===>', fileUploaded?.id);

            // create social
            const socialItems = socialsDumb.filter((item) => item?.companyId === companyDumb?.id);
            console.log('Social items ===>', socialItems);

            const socials = [];
            if (socialItems.length > 0) {
              for (const socialItem of socialItems) {
                const newSocial = await prisma.social.create({
                  data: {
                    type: socialItem.type as SocialType,
                    url: socialItem.url
                  }
                });
                socials.push({ id: newSocial.id });
              }
            }
            console.log('Socials ===>', socials);

            const newCompany = await prisma.company.create({
              data: {
                type: {
                  connect: {
                    id: companyType
                  }
                },
                size: {
                  connect: {
                    id: companySize
                  }
                },
                name: companyDumb.name,
                slug: slug(companyDumb.name),
                address: {
                  connect: {
                    id: cityId
                  }
                },
                social: { connect: socials },
                user: {
                  connect: {
                    id: user.id
                  }
                },
                addressDetail: city.name,
                description: companyDumb.description,
                avatar:
                  fileUploaded && fileUploaded?.id
                    ? {
                        connect: {
                          id: fileUploaded.id
                        }
                      }
                    : undefined,
                industries: {
                  connect: industries
                }
              }
            });
            totalCompany += 1;
            console.log(
              `Create successfully ${totalCompany} companies, COMPANY NAME = ${newCompany.name}`
            );
          }
        },
        { timeout: 10000000 }
      );
    }
    console.log('Result ===>', totalCompany);
    return totalCompany;
  }

  async devJobsDumb() {
    try {
      this.devJobDumb('https://idoxb2w.sufydely.com/jobs-3000-record-per-row/job-4.json');
      this.devJobDumb('https://idoxb2w.sufydely.com/jobs-3000-record-per-row/job-5.json');
      return 123;
    } catch (error) {
      console.log('error===>', error);
      throw error;
    }
  }

  async devJobDumb(url: string) {
    try {
      const jobsFetched = await firstValueFrom(this.httpService.get(url));
      const jobsDumb = jobsFetched?.data?.rows || jobsFetched?.data?.data?.rows;
      console.log('Total Job Will Dumb===>', jobsDumb?.length);

      const batchSize = 10; // Adjust batch size
      let totalCompany = 0;

      let user = await this.prismaService.user.findFirst({
        where: { role: 'super_admin' }
      });
      if (!user || !user?.id) {
        user = await this.prismaService.user.create({
          data: {
            avatarUrl:
              'https://lh3.googleusercontent.com/a/ACg8ocLRgOOu5zILwbtpyNJ7rhh0y_wBHtxeo8zQ4WkpF3Xu-BkaXzKJ=s96-c',
            lastName: 'Admin',
            firstName: 'Super',
            email: 'super-finder@yopmail.com',
            emailVerified: true,
            password: '$2a$10$r6tEurNNJRVtCwR5p.6cxudB2.WCQAlkHnaL4.PkZ5OKZkGMRrhpS',
            phoneNumber: '000000000',
            countryId: 242,
            status: 'active',
            signInProvider: 'google',
            color: '#586EE0',
            role: 'super_admin'
          }
        });
      }

      for (let i = 0; i < jobsDumb?.length; i += batchSize) {
        const jobsBatch = jobsDumb.slice(i, i + batchSize);
        await this.prismaService.$transaction(
          async (prisma) => {
            for (const jobItemDumb of jobsBatch) {
              console.log('jobItemDumb===>', jobItemDumb);
              // job category
              console.log('jobItemDumb?.category===>', jobItemDumb?.category);
              let jobCategory = await this.prismaService.jobCategory.findFirst({
                where: {
                  name: {
                    contains: jobItemDumb?.category || 'Business & Sales',
                    mode: 'insensitive'
                  }
                }
              });
              console.log('jobCategory====>', jobCategory);
              if (!jobCategory || !jobCategory.id) {
                jobCategory = await this.prismaService.jobCategory.findFirst();
              }

              // job title
              console.log('jobItemDumb?.title====>', jobItemDumb?.title);
              let jobTitle = await this.prismaService.jobTitle.findFirst({
                where: {
                  name: { contains: jobItemDumb?.title || 'Abatement Worker', mode: 'insensitive' }
                }
              });
              console.log('jobTitle===>', jobTitle);
              if (!jobTitle || !jobTitle.id) {
                jobTitle = await this.prismaService.jobTitle.findFirst();
              }

              // companies
              console.log('jobItemDumb?.company?.name====>', jobItemDumb?.company?.name);
              let company = await this.prismaService.company.findFirst({
                where: {
                  name: { contains: jobItemDumb?.company?.name ?? 'Anchanto', mode: 'insensitive' }
                }
              });
              console.log('company====>', company);
              if (!company || !company.id) {
                company = await this.prismaService.company.findFirst();
              }

              // tags
              const tags = [];
              const tagsDumb = jobItemDumb?.tags ?? [];
              if (tagsDumb && tagsDumb.length > 0) {
                let tagsValid = await this.prismaService.tag.findMany({
                  where: { name: { in: tagsDumb, mode: 'insensitive' } }
                });
                if (!tagsValid || tagsValid.length <= 0) {
                  tagsValid = await this.prismaService.tag.findMany({ take: 2 });
                }

                tagsValid.map((item) => {
                  tags.push({ id: item.id });
                });
              } else {
                const tagData = await this.prismaService.tag.findMany({ take: 2 });
                tagData.map((item) => {
                  tags.push({ id: item.id });
                });
              }

              // skills
              const skills = [];
              const skillsDumb = jobItemDumb?.skills ?? [];
              if (skillsDumb && skillsDumb.length > 0) {
                let skillsValid = await this.prismaService.skill.findMany({
                  where: { content: { in: skillsDumb, mode: 'insensitive' } }
                });
                if (!skillsValid || skillsValid.length <= 0) {
                  skillsValid = await this.prismaService.skill.findMany({ take: 2 });
                }

                skillsValid.map((item) => {
                  skills.push({ id: item.id });
                });
              } else {
                const skillData = await this.prismaService.skill.findMany({ take: 2 });
                skillData.map((item) => {
                  skills.push({ id: item.id });
                });
              }

              const cities = await this.prismaService.city.findMany({ select: { id: true } });
              const listCity = cities.map((item) => item.id);
              const cityId = this.random(listCity);
              const city = await this.prismaService.city.findFirst({ where: { id: cityId } });
              const applicationDeadline = addDays(new Date(), 60);
              await prisma.job.create({
                data: {
                  type: JobType.contract,
                  level: JobLevel.entry,
                  slug: '',
                  address: {
                    connect: {
                      id: cityId
                    }
                  },
                  addressDetail: city.name,
                  jobTitle: {
                    connect: {
                      id: jobTitle.id
                    }
                  },
                  jobCategory: {
                    connect: {
                      id: jobCategory.id
                    }
                  },
                  company: {
                    connect: {
                      id: company.id
                    }
                  },
                  description: jobItemDumb?.description,
                  tags: {
                    connect: tags
                  },
                  isBoot: jobItemDumb?.boosted ?? false,
                  numberOfRecruits: jobItemDumb?.totalRecruit ?? 1,
                  user: {
                    connect: { id: user.id }
                  },
                  applicationDeadline,
                  minSalary: jobItemDumb?.minSalary || null,
                  maxSalary: jobItemDumb?.maxSalary || null,
                  salary: (jobItemDumb?.salaryFormat as JobSalary) || JobSalary.discuss,
                  coverLetterRequired: jobItemDumb?.coverLetterRequired ?? false,
                  status: JobStatus.published,
                  skills: {
                    connect: skills
                  }
                }
              });

              totalCompany += 1;
            }
          },
          { timeout: 10000000 }
        );
      }
      return totalCompany;
    } catch (error) {
      console.log('error===>', error);
      throw error;
    }
  }

  async devPostDumb() {
    try {
      let user = await this.prismaService.user.findFirst({ where: { role: 'super_admin' } });
      if (!user || !user?.id) {
        user = await this.prismaService.user.create({
          data: {
            avatarUrl:
              'https://lh3.googleusercontent.com/a/ACg8ocLRgOOu5zILwbtpyNJ7rhh0y_wBHtxeo8zQ4WkpF3Xu-BkaXzKJ=s96-c',
            lastName: 'Admin',
            firstName: 'Super',
            email: 'super-finder@yopmail.com',
            emailVerified: true,
            password: '$2a$10$r6tEurNNJRVtCwR5p.6cxudB2.WCQAlkHnaL4.PkZ5OKZkGMRrhpS',
            phoneNumber: '000000000',
            countryId: 242,
            status: 'active',
            signInProvider: 'google',
            color: '#586EE0',
            role: 'super_admin'
          }
        });
      }
      const categories = await this.prismaService.postCategory.findMany({ select: { id: true } });
      const tags = await this.prismaService.tag.findMany({ select: { id: true } });
      const jobCategories = await this.prismaService.jobCategory.findMany({ select: { id: true } });

      const listJobCategory = jobCategories.map((item) => item.id);
      const listTags = tags.map((item) => item.id);
      const listCategories = categories.map((item) => item.id);

      const FILE_PATH = 'https://d2rp8rvurt6n5g.cloudfront.net';
      const batchSize = 10; // Adjust batch size
      const postsDumb = posts?.data?.rows ?? [];
      let totalCompany = 0;

      for (let i = 0; i < postsDumb.length; i += batchSize) {
        const batch = postsDumb.slice(i, i + batchSize);
        await this.prismaService.$transaction(
          async (prisma) => {
            for (const postDumb of batch) {
              const listTagId = this.random(listTags);
              const listTagId1 = this.random(listTags);
              const listTagId2 = this.random(listTags);
              const listTagIds = [{ id: listTagId }, { id: listTagId1 }, { id: listTagId2 }];

              const listCategoryId = this.random(listCategories);
              const listCategoryId1 = this.random(listCategories);
              const listCategoryId2 = this.random(listCategories);
              const listCategoryIds = [
                { id: listCategoryId },
                { id: listCategoryId1 },
                { id: listCategoryId2 }
              ];
              let jobCategoryId = '';
              const categoryValid = await this.prismaService.jobCategory.findFirst({
                where: { name: { contains: postDumb.contentCategory, mode: 'insensitive' } }
              });
              if (categoryValid) {
                jobCategoryId = categoryValid.id;
              } else {
                jobCategoryId = this.random(listJobCategory);
              }

              const thumbnailUrl = postDumb?.thumbnailUrl;
              let fileUploaded: any = null;
              if (thumbnailUrl && thumbnailUrl.length > 0) {
                const cloudinaryFile = await this.cloudinaryService.uploadFile(
                  `${FILE_PATH}/${thumbnailUrl}`
                );
                console.log('cloudinaryFile===>', cloudinaryFile?.public_id);
                if (
                  cloudinaryFile &&
                  cloudinaryFile.public_id &&
                  cloudinaryFile.public_id.length > 0
                ) {
                  fileUploaded = await this.fileService.createFromStorageId(
                    cloudinaryFile.public_id,
                    {
                      folder: `${STORE_FOLDER}/career-post`
                    }
                  );
                }
              }
              console.log('Created file successfully===>', fileUploaded?.id);
              const postValid = await prisma.post.findFirst({
                where: { slug: { contains: postDumb.slug, mode: 'insensitive' } }
              });
              if (!postValid) {
                await prisma.post.create({
                  data: {
                    title: postDumb?.title,
                    content: postDumb?.postDescription ?? '',
                    shareUrl: postDumb?.shareLinkUrl,
                    metadata: postDumb?.metaInfoShareLink
                      ? JSON.stringify({
                          title: postDumb?.metaInfoShareLink?.title ?? '',
                          description: postDumb?.metaInfoShareLink?.description ?? '',
                          imageUrl: postDumb?.metaInfoShareLink?.imageUrl ?? '',
                          url: postDumb?.metaInfoShareLink?.url ?? '',
                          originUrl: postDumb?.shareLinkUrl ?? ''
                        })
                      : null,
                    slug: postDumb?.slug,
                    minRead: postDumb?.minRead,
                    jobCategory: {
                      connect: {
                        id: jobCategoryId
                      }
                    },
                    author: {
                      connect: {
                        id: user.id
                      }
                    },
                    thumbnails:
                      fileUploaded && fileUploaded?.id
                        ? {
                            connect: {
                              id: fileUploaded.id
                            }
                          }
                        : undefined,
                    categories: {
                      connect: listCategoryIds
                    },
                    tags: {
                      connect: listTagIds
                    }
                  }
                });
              }

              totalCompany += 1;
              console.log(`Create Successfully with POST NAME = ${postDumb.title}`);
            }
          },
          { timeout: 10000000 }
        );
      }
      return totalCompany;
    } catch (error) {
      console.log('Error===>', error);
      throw error;
    }
  }

  random(arr: any) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
