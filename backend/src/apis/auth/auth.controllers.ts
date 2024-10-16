import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './services/user.service';
import { AuthUser } from 'src/core/decorators/authuser.decorator';
import { AccountType, User } from './schemas/user.schema';
import { EInternalError } from 'src/core/models/exception.models';
import { ChangePasswordDTO, CreateFirebaseUserDTO, EditProfileDTO, EditUserDTO, SelfChangePasswordDTO } from './dtos/user.dtos';
import { StrippedBody } from 'src/core/decorators/retain.decorator';
import { Roles } from 'src/core/decorators/role.decorators';

//CHORES: Move unrelated request to it's own controller
@Controller('auth')
@Roles(AccountType.employee, AccountType.organization)
export class AuthController {
    constructor(private user$: UserService) {}
    @Get('')
    //TODO: Account type checking
    async getUser(@AuthUser() user: User) {
      try {
        return this.user$.getPopulatedUser(user._id.toString());
      } catch (err) {
        throw new EInternalError(err);
      }
    }

    @Get('')
    async getUserById(@Query("id") id: string) {
      return await this.getUserById(id);
    }

    @Get('all')
    async getAllUser() {
      return await this.user$.getAllUser();
    }

    @Post('')
    async createUser(@Body() dto: CreateFirebaseUserDTO) {
      return await this.user$.createFirebaseUser(dto);
    }

    @Patch('myprofile')
    async editMyProfile(@AuthUser() user, @StrippedBody(["_id", "accountType"]) dto: EditProfileDTO) {
      dto._id = user._id;
      return await this.user$.editUser(dto);
    }

    @Patch('mypassword')
    async changeMyPassword(@AuthUser() user, @Body() dto: SelfChangePasswordDTO) {
      
      return await this.user$.changeUserPassword(user.userId, dto.password);
    }

    @Patch('')
    async editUser(@StrippedBody() dto: EditUserDTO) {
      return await this.user$.editUser(dto);
    }

    @Patch('password')
    async changeUserPassword(@Body() dto: ChangePasswordDTO) {
      return await this.user$.changeUserPassword(dto.uid, dto.password);
    }
    
    @Delete('')
    async deleteUser(@Query("id") id: string) {
      return await this.user$.deleteUser(id);
    }
}