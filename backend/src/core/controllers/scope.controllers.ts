import { Model } from "mongoose";
import { CreateDTO, ObjectIdDTO, UpdateDTO } from "../dtos/global.dtos";
import { EInternalError, ENotFound, EUnauth } from "../models/exception.models";
import { CRUDService, IdentifiableService, OrganizationScopeService, RestaurantScopeService, TableScopeService } from "../services/scope.services";
import { Get, Query, Post, Patch, Delete, Body } from "@nestjs/common";
import { MongooseModel } from "../models/timestamp.model";
import { OrganizationScope, RestaurantScope, TableScope } from "../models/scope.model";
import { AuthUser } from "../decorators/authuser.decorator";
import { AccountType, User } from "src/apis/auth/schemas/user.schema";
import { Roles } from "../decorators/role.decorators";
import { StrippedBody } from "../decorators/retain.decorator";

export abstract class CRUDController<T extends MongooseModel> {
    __service: CRUDService<T>;
    constructor(service: CRUDService<T>) {
        this.__service = service;
    }

    @Post('')
    @Roles(AccountType.employee, AccountType.organization)
    async create(@StrippedBody(['_id']) dto: CreateDTO<T>, @AuthUser() user: User|null): Promise<T> {
        if (user) dto.owner = user._id;
        return await this.__service.create(dto)
    }
    @Patch('')
    @Roles(AccountType.employee, AccountType.organization)
    async update(@StrippedBody(['createdAt', 'updatedAt']) dto: UpdateDTO<T>, @AuthUser() user: User|null): Promise<T> {
        if (user) dto.owner = user._id;
        return await this.__service.update(dto)
    }
    @Delete('')
    @Roles(AccountType.employee, AccountType.organization)
    async delete(@Query() dto: ObjectIdDTO, @AuthUser() user: User|null): Promise<T> {
        console.log(dto);
        return await this.__service.delete(dto)
    }
}

export abstract class IdentifiableController<T extends MongooseModel> extends CRUDController<T> {
    __service: IdentifiableService<T>;
    constructor(service: IdentifiableService<T>) {
        super(service);
        this.__service = service;
    }
    @Get('owned')
    @Roles(AccountType.employee, AccountType.organization)
    async findOwned(@AuthUser() user: User|null): Promise<T[]> {
        if (!user) throw new EInternalError();
        return await this.__service.findOwned(user);
    }
    @Get('id')
    async findById(@Query() dto: ObjectIdDTO): Promise<T> {
        return await this.__service.findById(dto)
    }
    @Get('all')
    async findAll(): Promise<T[]> {
        return await this.__service.findAll()
    }
}

export abstract class OrganizationScopeController<T extends OrganizationScope> extends IdentifiableController<T> {
    __service: OrganizationScopeService<T>;
    constructor(service: OrganizationScopeService<T>) {
        super(service);
        this.__service = service;
    }
    @Get('org')
    async findByOrgId(@Query() dto: ObjectIdDTO): Promise<T[]> {
        return await this.__service.findByOrgId(dto)
    }
}

export abstract class RestaurantScopeController<T extends RestaurantScope> extends OrganizationScopeController<T> {
    __service: RestaurantScopeService<T>;
    constructor(service: RestaurantScopeService<T>) {
        super(service);
        this.__service = service;
    }
    
    @Get('resto')
    async findByRestoId(@Query() dto: ObjectIdDTO): Promise<T[]> {
        return await this.__service.findByRestoId(dto)
    }
}

export abstract class TableScopeController<T extends TableScope> extends RestaurantScopeController<T> {
    __service: TableScopeService<T>;
    constructor(service: TableScopeService<T>) {
        super(service);
        this.__service = service;
    }
    
    @Get('table')
    async findByTableId(@Query() dto: ObjectIdDTO): Promise<T[]> {
        return await this.__service.findByTableId(dto)
    }
}