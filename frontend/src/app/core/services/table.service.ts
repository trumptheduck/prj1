import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestaurantScopeRepo } from '../repos/scope.repo';
import { ITable } from '../models/table.model';
import { RestaurantScopeDataService } from './scope.service';
import { RestaurantScopePath } from '../enum/api_path.enums';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class TableService extends RestaurantScopeDataService<ITable> {
  constructor(private http: ApiService) {
    super(new RestaurantScopeRepo<ITable>(http, new RestaurantScopePath("table")));
  }
}