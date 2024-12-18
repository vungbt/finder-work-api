import { STORE_FOLDER } from '@/configs/constant';
import { ResumeWhereInput } from '@/prisma/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/utils/base/base.service';
import { isValidUuid, responseHelper } from '@/utils/helpers';
import { Injectable } from '@nestjs/common';
import {
  Activity,
  Certificate,
  Education,
  Prisma,
  PrismaClient,
  Project,
  Social,
  WorkExperience
} from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PdfService } from '../common/pdf/pdf.service';
import { CompanyService } from '../company/company.service';
import { FileService } from '../file/file.service';
import {
  AllResumeArgs,
  CreateResumeArgs,
  MyResumeArgs,
  ResumeActivity,
  ResumeCertificate,
  ResumeEducation,
  ResumeProject,
  ResumeSocial,
  ResumeWorkExperience
} from './resume-type.type';

@Injectable()
export class ResumeService implements BaseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
    private readonly companyService: CompanyService,
    private readonly pdfService: PdfService
  ) {}
  create(args: Prisma.ResumeCreateArgs) {
    return this.prismaService.resume.create(args);
  }
  findUnique(args: Prisma.ResumeFindUniqueArgs) {
    return this.prismaService.resume.findUnique(args);
  }
  findFirst(args: Prisma.ResumeFindFirstArgs) {
    return this.prismaService.resume.findFirst(args);
  }
  async findMany(args: AllResumeArgs) {
    const { searchValue, pagination, where, ...reset } = args;
    let whereClause: ResumeWhereInput = {};
    if (searchValue && searchValue.length > 0) {
      whereClause.OR = [
        { name: { contains: searchValue, mode: 'insensitive' } },
        { fullName: { contains: searchValue, mode: 'insensitive' } }
      ];
    }
    if (where) {
      whereClause = {
        AND: [whereClause, where]
      };
    }
    const data = this.prismaService.resume.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      ...reset
    });
    const total = await this.count({ where: whereClause });
    return responseHelper(data, { total, ...pagination });
  }
  count(args: Prisma.ResumeCountArgs) {
    return this.prismaService.resume.count(args);
  }
  update(args: Prisma.ResumeUpdateArgs) {
    return this.prismaService.resume.update(args);
  }
  delete(args: Prisma.ResumeDeleteArgs) {
    return this.prismaService.resume.delete(args);
  }
  preview(args: CreateResumeArgs) {
    return this.pdfService.generatePdf(args.resumeTemplateName, {
      jobTitle: args.personalInfo.jobTitleId,
      email: args.personalInfo.email,
      name: args.personalInfo.name,
      phoneNumber: args.personalInfo.phoneNumber,
      address: args.personalInfo.addressDetail,
      description: args.personalInfo.description,
      workExperiences: args.workExperiences,
      projects: args.projects,
      educations: args.educations,
      languageSkills: args.languageSkillIds,
      skillContents: args.skillContents,
      certificates: args.certificates,
      socials: args.socials,
      profileSummary: args.personalInfo.description,
      profileImage: args.personalInfo.avatarPublicId
    });
  }
  async createResume(args: CreateResumeArgs) {
    const {
      personalInfo,
      workExperiences,
      projects,
      educations,
      languageSkillIds,
      skillIds,
      certificates,
      socials,
      activities,
      resumeTemplateName,
      userId
    } = args;

    try {
      // if (!userId && !email)
      //   throw new HttpException({ key: 'error.valid_error' }, HttpStatus.BAD_REQUEST);
      return this.prismaService.$transaction(
        async (prisma) => {
          // work experiences
          const workExperiencesResult = await this.createWorkExperienceTransaction(
            userId,
            workExperiences,
            prisma
          );
          // projects,
          const projectsResult = await this.createProjectTransaction(userId, projects, prisma);
          // education
          const educationsResult = await this.createEducationTransaction(
            userId,
            educations,
            prisma
          );
          // certificates
          const certificatesResult = await this.createCertificateTransaction(certificates, prisma);
          // socials
          const socialsResult = await this.createSocialTransaction(userId, socials, prisma);
          // activities
          const activitiesResult = await this.createActivityTransaction(activities, prisma);

          // personal info
          let newAvatarId = personalInfo.avatarId;
          if (!newAvatarId || newAvatarId.length <= 0 || !isValidUuid(newAvatarId)) {
            const avatarPublicId = personalInfo.avatarPublicId;
            const avatar = await this.fileService.createFromStorageId(avatarPublicId, {
              folder: STORE_FOLDER
            });
            newAvatarId = avatar.id;
          }

          // gen pdf after saved
          const { pdfOutput, imgOutput } = await this.pdfService.generatePdf(resumeTemplateName, {
            email: personalInfo.email
          });
          const pdfFile = await this.fileService.uploadFile(pdfOutput);
          const screenshotFile = await this.fileService.uploadFile(imgOutput);

          const resume = await prisma.resume.create({
            data: {
              // personal info
              name: personalInfo.name,
              user: {
                connect: { id: userId }
              },
              avatar: {
                connect: { id: newAvatarId }
              },
              fullName: personalInfo.fullName,
              email: personalInfo.email,
              phoneNumber: personalInfo.phoneNumber,
              address: {
                connect: {
                  id: personalInfo.cityId
                }
              },
              addressDetail: personalInfo.addressDetail,
              description: personalInfo.description,
              isSummary: personalInfo.isSummary,
              jobTitle: {
                connectOrCreate: {
                  where: { name: personalInfo.jobTitleId },
                  create: { name: personalInfo.jobTitleId }
                }
              },
              thumbnail: {
                connect: { id: screenshotFile.id }
              },
              pdf: {
                connect: { id: pdfFile.id }
              },
              workExperiences: {
                connect: workExperiencesResult.map((item) => ({
                  id: item.id
                }))
              },
              projects: {
                connect: projectsResult.map((project) => ({
                  id: project.id
                }))
              },
              educations: {
                connect: educationsResult.map((education) => ({
                  id: education.id
                }))
              },
              languageSkills: {
                connect: languageSkillIds.map((id) => ({
                  id
                }))
              },
              skills: {
                connect: skillIds.map((id) => ({
                  id
                }))
              },
              certificates: {
                connect: certificatesResult.map((certificate) => ({
                  id: certificate.id
                }))
              },
              socials: {
                connect: socialsResult.map((social) => ({
                  id: social.id
                }))
              },
              activities: {
                connect: activitiesResult.map((activity) => ({
                  id: activity.id
                }))
              }
            }
          });

          return resume;
        },
        {
          timeout: 30000
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async createWorkExperienceTransaction(
    userId: string,
    workExperiences: ResumeWorkExperience[],
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ): Promise<WorkExperience[]> {
    const workExperiencesResult = [];
    for (
      let workExperienceIndex = 0;
      workExperienceIndex < workExperiences.length;
      workExperienceIndex++
    ) {
      const workExperience = workExperiences[workExperienceIndex];
      const newCompany = await this.companyService.createIfInvalid(
        {
          name: workExperience.companyName,
          id: workExperience.companyId
        },
        prisma
      );

      const workExperienceItem = await prisma.workExperience.create({
        data: {
          jobTitle: {
            connectOrCreate: {
              where: { name: workExperience.jobTitleId },
              create: { name: workExperience.jobTitleId }
            }
          },
          user: {
            connect: { id: userId }
          },
          company: { connect: { id: newCompany.id } },
          isFreelancer: workExperience.isFreelancer,
          isCurrentlyWorkHere: workExperience.isCurrentlyWorkHere,
          address: { connect: { id: workExperience.cityId } },
          description: workExperience.description,
          startAt: workExperience.startAt,
          endAt: workExperience.endAt
        }
      });
      workExperiencesResult.push(workExperienceItem);
    }
    return workExperiencesResult;
  }
  async createProjectTransaction(
    userId: string,
    projects: ResumeProject[],
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ): Promise<Project[]> {
    const projectsResult = [];
    for (let projectIndex = 0; projectIndex < projects.length; projectIndex++) {
      const project = projects[projectIndex];
      const newCompany = await this.companyService.createIfInvalid(
        {
          name: project.companyName,
          id: project.companyId
        },
        prisma
      );

      let newThumbnailId = project.thumbnailId;

      if (!newThumbnailId || newThumbnailId.length <= 0 || !isValidUuid(newThumbnailId)) {
        const thumbnailPublicId = project.thumbnailPublicId;
        const thumbnail = await this.fileService.createFromStorageId(thumbnailPublicId, {
          folder: STORE_FOLDER
        });
        newThumbnailId = thumbnail.id;
      }

      const projectItem = await prisma.project.create({
        data: {
          title: project.title,
          description: project.description,
          teamSize: project.teamSize,
          role: project.role,
          techStacks: { connect: project.techStackIds.map((item) => ({ id: item })) },
          startAt: project.startAt,
          endAt: project.endAt,
          isFreelancer: project.isFreelancer,
          refeUrls: project?.refeUrls ?? [],
          user: {
            connect: { id: userId }
          },
          company: { connect: { id: newCompany.id } },
          thumbnail: { connect: { id: newThumbnailId } }
        }
      });
      projectsResult.push(projectItem);
    }
    return projectsResult;
  }

  async createEducationTransaction(
    userId: string,
    educations: ResumeEducation[],
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ): Promise<Education[]> {
    const educationsResult = [];
    for (let educationIndex = 0; educationIndex < educations.length; educationIndex++) {
      const education = educations[educationIndex];
      const educationItem = await prisma.education.create({
        data: {
          type: education.type,
          major: { connect: { id: education.majorId } },
          degree: education.degree,
          graduationAt: education.graduationAt,
          gpa: education.gpa,
          awards: education.awards,
          relevantCourseWorks: education.relevantCourseWorks,
          user: {
            connect: { id: userId }
          }
        }
      });
      educationsResult.push(educationItem);
    }
    return educationsResult;
  }

  async createCertificateTransaction(
    certificates: ResumeCertificate[],
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ): Promise<Certificate[]> {
    const certificatesResult = [];
    for (let certificateIndex = 0; certificateIndex < certificates.length; certificateIndex++) {
      const certificate = certificates[certificateIndex];
      let newFileId = certificate.fileId;
      if (!newFileId || newFileId.length <= 0 || !isValidUuid(newFileId)) {
        const filePublicId = certificate.filePublicId;
        const file = await this.fileService.createFromStorageId(filePublicId, {
          folder: STORE_FOLDER
        });
        newFileId = file.id;
      }
      const certificateItem = await prisma.certificate.create({
        data: {
          name: certificate.name,
          file: {
            connect: { id: newFileId }
          }
        }
      });
      certificatesResult.push(certificateItem);
    }
    return certificatesResult;
  }

  async createActivityTransaction(
    activities: ResumeActivity[],
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ): Promise<Activity[]> {
    const activitiesResult = [];
    for (let activityIndex = 0; activityIndex < activities.length; activityIndex++) {
      const activity = activities[activityIndex];
      const activityItem = await prisma.activity.create({
        data: {
          name: activity.name,
          startAt: activity.startAt,
          endAt: activity.endAt,
          description: activity.description
        }
      });
      activitiesResult.push(activityItem);
    }
    return activitiesResult;
  }

  async createSocialTransaction(
    userId: string,
    socials: ResumeSocial[],
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ): Promise<Social[]> {
    const socialsResult = [];
    for (let socialIndex = 0; socialIndex < socials.length; socialIndex++) {
      const social = socials[socialIndex];
      const socialItem = await prisma.social.create({
        data: {
          type: social.type,
          url: social.url,
          user: {
            connect: { id: userId }
          }
        }
      });
      socialsResult.push(socialItem);
    }
    return socialsResult;
  }

  async myResume(args: MyResumeArgs) {
    const { userId, searchValue, pagination, where, ...reset } = args;
    let whereClause: ResumeWhereInput = {};
    if (searchValue && searchValue.length > 0) {
      whereClause.OR = [
        { name: { contains: searchValue, mode: 'insensitive' } },
        { fullName: { contains: searchValue, mode: 'insensitive' } }
      ];
    }
    if (where) {
      whereClause = {
        AND: [whereClause, where]
      };
    }
    const data = this.prismaService.resume.findMany({
      where: {
        AND: [
          whereClause,
          {
            user: {
              id: userId
            }
          }
        ]
      },
      orderBy: { createdAt: 'desc' },
      ...reset,
      include: {
        thumbnail: true
      }
    });
    const total = await this.count({ where: whereClause });
    return responseHelper(data, { total, ...pagination });
  }
}
