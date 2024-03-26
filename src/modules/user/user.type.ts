import { User } from '@/prisma/graphql';
import { ObjectType, OmitType } from '@nestjs/graphql';

@ObjectType()
export class UserOnly extends OmitType(User, ['password', 'verifyCode']) {}
