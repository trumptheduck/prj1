import { IMongooseModel, IOrganizationScope, IRestaurantScope, ITableScope, ITimestampModel } from "../interface/scope.interfaces";
import { Observable } from "rxjs";
import { CRUDRepo, IdentifiableRepo, OrganizationScopeRepo, RestaurantScopeRepo, TableScopeRepo } from "../repos/scope.repo";

export class CRUDDataService<T extends IMongooseModel> {
    constructor(protected repo: CRUDRepo<T>) {}

    create(data: T): Observable<T> {
        return this.repo.create(data);
    }

    update(data: T): Observable<T> {
        return this.repo.update(data);
    }

    delete(id: string): Observable<T> {
        return this.repo.delete(id);
    }
}

export class IdentifiableDataService<T extends ITimestampModel> extends CRUDDataService<T> {
    constructor(protected override repo: IdentifiableRepo<T>) {
        super(repo);
    }

    findOwned(): Observable<T[]> {
        return this.repo.findOwned();
    }

    findById(id: string): Observable<T> {
        return this.repo.findById(id);
    }

    findAll(): Observable<T[]> {
        return this.repo.findAll();
    }
}

export class OrganizationScopeDataService<T extends IOrganizationScope> extends IdentifiableDataService<T> {
    constructor(protected override repo: OrganizationScopeRepo<T>) {
        super(repo);
    }

    findByOrgId(id: string): Observable<T[]> {
        return this.repo.findByOrgId(id);
    }
}

export class RestaurantScopeDataService<T extends IRestaurantScope> extends OrganizationScopeDataService<T> {
    constructor(protected override repo: RestaurantScopeRepo<T>) {
        super(repo);
    }

    findByRestoId(id: string): Observable<T[]> {
        return this.repo.findByRestoId(id);
    }
}

export class TableScopeDataService<T extends ITableScope> extends RestaurantScopeDataService<T> {
    constructor(protected override repo: TableScopeRepo<T>) {
        super(repo);
    }

    findByTableId(id: string): Observable<T[]> {
        return this.repo.findByTableId(id);
    }
}