import { Model } from "mongoose";
import { CreateDTO, ObjectIdDTO, UpdateDTO } from "../dtos/global.dtos";
import { EInternalError, ENotFound } from "../models/exception.models";
import { MongooseModel } from "../models/timestamp.model";
import { OrganizationScope, RestaurantScope, TableScope } from "../models/scope.model";
import { User } from "src/apis/auth/schemas/user.schema";

export abstract class CRUDService<T extends MongooseModel> {
    __model: Model<any>;
    doUpdate: Boolean = false;
    constructor(model: Model<any>) {
        this.__model = model;
    }

    async sendRealtimeUpdate(data: T) {}

    async create(dto: CreateDTO<T>): Promise<T> {
        try {
            console.log(dto);
            const record = await new this.__model(dto).save();
            return record;
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async update(dto: UpdateDTO<T>): Promise<T> {
        try {
            const record = await this.__model.findByIdAndUpdate(dto._id, dto, {new: true});
            if (this.doUpdate) {
                this.sendRealtimeUpdate(record);
            }
            return record;
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async delete(dto: ObjectIdDTO): Promise<T> {
        try {
            const record = await this.__model.findByIdAndDelete(dto.id);
            return record;
        } catch (err) {
            throw new EInternalError(err);
        }
    }
}

export abstract class IdentifiableService<T extends MongooseModel> extends CRUDService<T> {
    __model: Model<any>;
    constructor(model: Model<any>) {
        super(model);
        this.__model = model;
    }
    async findById(dto: ObjectIdDTO): Promise<T> {
        try {
            const record = await this.__model.findById(dto.id);
            if (!record) throw new ENotFound()
            return record;
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async findAll(): Promise<T[]> {
        try {
            const records = await this.__model.find();
            return records;
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async findOwned(user: User): Promise<T[]> {
        try {
            const records = await this.__model.find({owner: user._id});
            return records;
        } catch (err) {
            throw new EInternalError(err);
        }
    }
}

export abstract class OrganizationScopeService<T extends OrganizationScope> extends IdentifiableService<T> {
    __model: Model<any>;
    constructor(model: Model<any>) {
        super(model);
        this.__model = model;
    }
    async findByOrgId(dto: ObjectIdDTO): Promise<T[]> {
        try {
            const records = await this.__model.find({orgId: dto.id});
            return records;
        } catch (err) {
            throw new EInternalError(err);
        }
    }
}

export abstract class RestaurantScopeService<T extends RestaurantScope> extends OrganizationScopeService<T> {
    __model: Model<any>;
    constructor(model: Model<any>) {
        super(model);
        this.__model = model;
    }
    async findByRestoId(dto: ObjectIdDTO): Promise<T[]> {
        try {
            const records = await this.__model.find({restoId: dto.id});
            return records;
        } catch (err) {
            throw new EInternalError(err);
        }
    }
}

export abstract class TableScopeService<T extends TableScope> extends RestaurantScopeService<T> {
    __model: Model<any>;
    constructor(model: Model<any>, doUpdate: Boolean = false) {
        super(model);
        this.__model = model;
        this.doUpdate = doUpdate;
    }

    async findByTableId(dto: ObjectIdDTO): Promise<T[]> {
        try {
            const records = await this.__model.find({tableId: dto.id});
            return records;
        } catch (err) {
            throw new EInternalError(err);
        }
    }
}