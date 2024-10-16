import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IdentifiableRepo, RestaurantScopeRepo } from '../repos/scope.repo';
import { IOrganization } from '../models/organization.model';
import { IdentifiableDataService } from './scope.service';
import { IdentifiablePath } from "../enum/api_path.enums";
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class OrganizationService extends IdentifiableDataService<IOrganization> {
  constructor(private http: ApiService) {
    super(new IdentifiableRepo<IOrganization>(http, new IdentifiablePath("org")));
  }
}