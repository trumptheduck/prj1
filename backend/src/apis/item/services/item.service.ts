import { Injectable } from "@nestjs/common";
import { Item, ItemDocument } from "../schemas/item.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RestaurantScopeService } from "src/core/services/scope.services";

@Injectable()
export class ItemService extends RestaurantScopeService<Item> {
    constructor(@InjectModel(Item.name) private _model: Model<ItemDocument>) {
        super(_model);
    }
}