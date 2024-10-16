import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AccountType, LoginType, User, UserDocument } from "../schemas/user.schema";
import { Model } from "mongoose"
import { EBadRequest, EInternalError, ENotFound, EUnprocessableEntity } from "src/core/models/exception.models";
import { CreateFirebaseUserDTO, CreateUserDTO, EditUserDTO } from "../dtos/user.dtos";
import { isStringEmpty } from "src/core/helpers/utils.helper";
import { FirebaseAdmin, InjectFirebaseAdmin } from "nestjs-firebase";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
        ) {}

    async getUserByUserId(userId: string) {
        try {
            const _user = await this.userModel.findOne({userId: userId}).select("-_id, -__v");
            return _user;
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async getUserById(id: string) {
        try {
            if (isStringEmpty(id)) throw EUnprocessableEntity.query("id");
            const _user = await this.userModel.findById(id);
            if (!_user) throw new ENotFound();
            return _user;
        } catch (err) {
            throw new EInternalError(err);
        }
    }
    async getPopulatedUser(id: string) {
        try {
            if (isStringEmpty(id)) throw EUnprocessableEntity.query("id");
            const _user = await this.userModel.findById(id);
            if (!_user) throw new ENotFound();
            return _user;
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async getAllUser() {
        try {
            return await this.userModel.find()
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async getUserFromToken(token: string) {
        try {
            const _fbUser = await this.firebase.auth.verifyIdToken(token);
            
            const _user = await this.getUserByUserId(_fbUser.uid);
            if (_user) return _user;
            let providers = _fbUser.firebase.identities;
            let email = _fbUser.email;
            let type = LoginType.email;
            let fullname = "Restwo User";
            if (providers['google.com']) {
                type = LoginType.google
                if (Array.isArray(providers['google.com'].email))
                    email = providers['google.com'].email[0];
                if ( _fbUser.name)
                    fullname = _fbUser.name
            }
            return await this.createUser({
                userId: _fbUser.uid,
                accountType: AccountType.employee,
                loginType: type,
                fullname: fullname,
                email: email,
            })
        } catch (err) {
            console.log(err);
            throw new EUnprocessableEntity(undefined, "Token không đúng");
        }
    }

    async createUser(dto: CreateUserDTO) {
        try {
            return await (new this.userModel(dto)).save()
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async editUser(dto: EditUserDTO) {
        try {
            const _user = await this.userModel.findByIdAndUpdate(dto._id, dto);
            if (!_user) throw new ENotFound();
            return await this.userModel.findById(_user._id);
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async deleteUser(id: string) {
        try {
            if (isStringEmpty(id)) throw EUnprocessableEntity.query("id");
            const _user = await this.userModel.findByIdAndDelete(id);
            if (!_user) throw new ENotFound();
            await this.firebase.auth.deleteUser(_user.userId);
            return _user;
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async createFirebaseUser(dto: CreateFirebaseUserDTO) {
        try {
            if (isStringEmpty(dto.email)) throw EUnprocessableEntity.field(".email");
            if (isStringEmpty(dto.password)) throw EUnprocessableEntity.field(".password");
            if (isStringEmpty(dto.fullname)) throw EUnprocessableEntity.field(".fullname");
            const _auth = await this.firebase.auth.createUser({
                email: dto.email,
                password: dto.password,
                emailVerified: true
            })
            return await this.createUser({
                fullname: dto.fullname,
                email: dto.email,
                userId: _auth.uid,
                accountType: dto.accountType??AccountType.employee,
                loginType: LoginType.email,
            })
        } catch (err) {
            throw new EInternalError(err);
        }
    }
    
    async changeUserPassword(uid: string, password: string) {
        try {
            await this.firebase.auth.updateUser(uid, {password: password});
            return true;
        } catch (err) {
            throw new EInternalError(err);
        }
    }
}