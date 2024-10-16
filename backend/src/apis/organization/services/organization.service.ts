import { Injectable } from "@nestjs/common";
import { IdentifiableService } from "src/core/services/scope.services";
import { Organization, OrganizationDocument } from "../schemas/organization.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class OrganizationService extends IdentifiableService<Organization> {
    constructor(@InjectModel(Organization.name) private _model: Model<OrganizationDocument>) {
        super(_model);
    }
}