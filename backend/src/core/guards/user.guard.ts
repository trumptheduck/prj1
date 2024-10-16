import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccountType, User } from 'src/apis/auth/schemas/user.schema';
import { arrayUnique, isArrayEmpty, onlyWithin, subtractArray } from '../helpers/utils.helper';
import { UserService } from 'src/apis/auth/services/user.service';
import { EForbidden, EUnauth } from '../models/exception.models';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(private reflector: Reflector, private user$: UserService) {}
    async canActivate(context: ExecutionContext,): Promise<boolean> {
        const rolesHandler = this.reflector.get<AccountType[]>('roles', context.getHandler())??[];
        const rolesClass = this.reflector.get<AccountType[]>('roles', context.getClass())??[];
        const norolesHandler = this.reflector.get<AccountType[]>('noroles', context.getHandler())??[];
        const norolesClass = this.reflector.get<AccountType[]>('noroles', context.getClass())??[];
        const roles = arrayUnique([...rolesClass, ...rolesHandler]);
        const noroles = subtractArray(arrayUnique([...norolesClass, ...norolesHandler]), rolesHandler);
        if (isArrayEmpty(roles)&&isArrayEmpty(noroles)) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const _user = await this.getUserData(request);
        response.locals.user = _user;
        
        return await this.validateRole(_user, roles, noroles);
    }

    async validateRole(user: User, roles: string[], noroles: string[]): Promise<boolean> {
        if (onlyWithin(user.accountType, noroles)) throw new EForbidden();
        if (isArrayEmpty(roles)||onlyWithin(user.accountType, roles)) {
            return true;
        } else {
            throw new EForbidden();
        }
    }

    async getUserData(request: Request): Promise<User> {
        const _authHeader = request.headers['authorization'];
        if (_authHeader?.startsWith("Bearer ")){
            const _token = _authHeader.substring(7, _authHeader.length);
            return this.user$.getUserFromToken(_token);
        } else {
            throw new EUnauth();
        }
    }
}