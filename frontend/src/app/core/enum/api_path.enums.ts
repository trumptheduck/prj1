export class APIHost {
    static uri: string = "http://localhost:3000/"
}

export class CRUDPath {
    create: string;
    update: string;
    delete: string;
    constructor(path: string) {
        this.create = APIHost.uri + path + "/";
        this.update = APIHost.uri + path + "/";
        this.delete = APIHost.uri + path + "/";
    }
}

export class IdentifiablePath extends CRUDPath {
    findOwned: string;
    findById: string;
    findAll: string;
    constructor(path: string) {
        super(path);
        this.findById = APIHost.uri + path + "/id";
        this.findOwned = APIHost.uri + path + "/owned";
        this.findAll = APIHost.uri + path + "/all";
    }
}

export class OrganizationScopePath extends IdentifiablePath {
    findByOrgId: string;
    constructor(path: string) {
        super(path);
        this.findByOrgId = APIHost.uri + path + "/org";
    }
}

export class RestaurantScopePath extends OrganizationScopePath {
    findByRestoId: string;
    constructor(path: string) {
        super(path);
        this.findByRestoId = APIHost.uri + path + "/resto";
    }
}

export class TableScopePath extends RestaurantScopePath {
    findByTableId: string;
    constructor(path: string) {
        super(path);
        this.findByTableId = APIHost.uri + path + "/table";
    }
}

export const UPLOAD_PATH = APIHost.uri + "file/upload/images";