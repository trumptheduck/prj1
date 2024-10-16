import { HttpClient, HttpParams } from "@angular/common/http";
import { IMongooseModel, IOrganizationScope, IRestaurantScope, ITableScope, ITimestampModel } from "../interface/scope.interfaces";
import { Observable } from "rxjs";
import { CRUDPath, IdentifiablePath, OrganizationScopePath, RestaurantScopePath, TableScopePath } from "../enum/api_path.enums";
import { ApiService } from "../services/api.service";

export class CRUDRepo<T extends IMongooseModel> {
    constructor(protected http: ApiService, protected path: CRUDPath) {}

    create(data: T): Observable<T> {
        return this.http.post<T>(this.path.create, data);
    }

    update(data: T): Observable<T> {
        return this.http.patch<T>(this.path.update, data);
    }

    delete(id: string): Observable<T> {
        return this.http.delete<T>(this.path.delete, {id});
    }
}

export class IdentifiableRepo<T extends ITimestampModel> extends CRUDRepo<T> {
    constructor(protected override http: ApiService, protected override path: IdentifiablePath) {
        super(http, path);
    }

    findById(id: string): Observable<T> {
        return this.http.get<T>(this.path.findById, {id});
    }

    findAll(): Observable<T[]> {
        return this.http.get<T[]>(this.path.findAll);
    }

    findOwned(): Observable<T[]> {
        return this.http.get<T[]>(this.path.findOwned);
    }
    
}

export class OrganizationScopeRepo<T extends IOrganizationScope> extends IdentifiableRepo<T> {
    constructor(protected override http: ApiService, protected override path: OrganizationScopePath) {
        super(http, path);
    }

    findByOrgId(id: string): Observable<T[]> {
        return this.http.get<T[]>(this.path.findByOrgId, {id});
    }
}

export class RestaurantScopeRepo<T extends IRestaurantScope> extends OrganizationScopeRepo<T> {
    constructor(protected override http: ApiService, protected override path: RestaurantScopePath) {
        super(http, path);
    }

    findByRestoId(id: string): Observable<T[]> {
        return this.http.get<T[]>(this.path.findByRestoId, {id});
    }
}

export class TableScopeRepo<T extends ITableScope> extends RestaurantScopeRepo<T> {
    constructor(protected override http: ApiService, protected override path: TableScopePath) {
        super(http, path);
    }

    findByTableId(id: string): Observable<T[]> {
        return this.http.get<T[]>(this.path.findByTableId, {id});
    }
}