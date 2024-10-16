export interface IMongooseModel {
    _id?: string;
    owner?: string;
}

export interface ITimestampModel extends IMongooseModel {
    createdAt?: Date
    updatedAt?: Date
}

export interface IOrganizationScope extends ITimestampModel {
    orgId: string
}

export interface IRestaurantScope extends IOrganizationScope {
    restoId: string
}

export interface ITableScope extends IRestaurantScope {
    tableId: string
}

export interface IDescribable {
    name: string
    description: string
}