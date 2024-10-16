import { SetMetadata } from '@nestjs/common';
import { AccountType } from 'src/apis/auth/schemas/user.schema';

export const Roles = (...roles: AccountType[]) => SetMetadata('roles', roles);

export const NoRoles = (...roles: AccountType[]) => SetMetadata('noroles', roles);