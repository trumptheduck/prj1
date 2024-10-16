import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrganizationScopeRepo } from '../repos/scope.repo';
import { IRestaurant } from '../models/restaurant.model';
import { OrganizationScopeDataService } from './scope.service';
import { OrganizationScopePath } from '../enum/api_path.enums';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class RestaurantService extends OrganizationScopeDataService<IRestaurant> {
  constructor(private http: ApiService) {
    super(new OrganizationScopeRepo<IRestaurant>(http, new OrganizationScopePath("resto")));
  }
}