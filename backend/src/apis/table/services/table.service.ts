import { Injectable } from "@nestjs/common";
import { OrganizationScopeService, RestaurantScopeService } from "src/core/services/scope.services";
import { Table, TableDocument } from "../schemas/table.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class TableService extends RestaurantScopeService<Table> {
    constructor(@InjectModel(Table.name) private _model: Model<TableDocument>) {
        super(_model);
    }
}