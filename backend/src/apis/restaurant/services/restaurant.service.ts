import { Injectable } from "@nestjs/common";
import { OrganizationScopeService } from "src/core/services/scope.services";
import { Restaurant, RestaurantDocument } from "../schemas/restaurant.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class RestaurantService extends OrganizationScopeService<Restaurant> {
    constructor(@InjectModel(Restaurant.name) private _model: Model<RestaurantDocument>) {
        super(_model);
    }
}